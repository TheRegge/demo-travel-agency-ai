/**
 * Rate Limiting Service
 * Implements IP-based rate limiting with session tracking
 * Uses in-memory storage for demo (production would use Redis)
 */

import { headers } from 'next/headers'

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  DAILY_SESSION_LIMIT: 5,
  SESSION_TOKEN_LIMIT: 2500,
  RESET_HOUR_UTC: 0, // Midnight UTC
  
  // Time windows
  WINDOW_SIZE_MS: 24 * 60 * 60 * 1000, // 24 hours
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes of inactivity
  
  // Cost tracking
  DAILY_COST_LIMIT: 5.00, // $5 per day
  ESTIMATED_COST_PER_TOKEN: 0.000002, // Rough estimate for Gemini
} as const

export interface RateLimitStatus {
  allowed: boolean
  reason?: 'session_limit' | 'token_limit' | 'cost_limit' | 'ok'
  sessionsUsed: number
  sessionsRemaining: number
  tokensUsed: number
  tokensRemaining: number
  estimatedCost: number
  resetTime: Date
  currentSessionId?: string
}

export interface SessionData {
  id: string
  ip: string
  startedAt: Date
  lastActivityAt: Date
  tokensUsed: number
  messageCount: number
}

interface DailyUsage {
  date: string // YYYY-MM-DD in UTC
  sessions: SessionData[]
  totalTokens: number
  estimatedCost: number
}

// In-memory storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, DailyUsage>()

class RateLimitService {
  /**
   * Gets the client IP from request headers
   */
  private async getClientIP(): Promise<string> {
    const headersList = await headers()
    
    // Check various headers that might contain the real IP
    const forwardedFor = headersList.get('x-forwarded-for')
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim()
    }
    
    const realIP = headersList.get('x-real-ip')
    if (realIP) {
      return realIP
    }
    
    // Fallback to a default if no IP found (shouldn't happen in production)
    return '127.0.0.1'
  }
  
  /**
   * Gets the current UTC date string
   */
  private getCurrentDateUTC(): string {
    return new Date().toISOString().split('T')[0]
  }
  
  /**
   * Gets or creates daily usage data for an IP
   */
  private getDailyUsage(ip: string): DailyUsage {
    const today = this.getCurrentDateUTC()
    const key = `${ip}:${today}`
    
    let usage = rateLimitStore.get(key)
    if (!usage) {
      usage = {
        date: today,
        sessions: [],
        totalTokens: 0,
        estimatedCost: 0
      }
      rateLimitStore.set(key, usage)
      
      // Clean up old entries (keep last 7 days)
      this.cleanupOldEntries()
    }
    
    return usage
  }
  
  /**
   * Cleans up entries older than 7 days
   */
  private cleanupOldEntries() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoffDate = sevenDaysAgo.toISOString().split('T')[0]
    
    for (const [key, usage] of rateLimitStore.entries()) {
      if (usage.date < cutoffDate) {
        rateLimitStore.delete(key)
      }
    }
  }
  
  /**
   * Gets the next reset time (midnight UTC)
   */
  private getNextResetTime(): Date {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(RATE_LIMIT_CONFIG.RESET_HOUR_UTC, 0, 0, 0)
    return tomorrow
  }
  
  /**
   * Checks rate limit status for the current request
   */
  async checkRateLimit(): Promise<RateLimitStatus> {
    const ip = await this.getClientIP()
    const usage = this.getDailyUsage(ip)
    
    // Remove expired sessions
    const now = new Date()
    usage.sessions = usage.sessions.filter(session => 
      now.getTime() - session.lastActivityAt.getTime() < RATE_LIMIT_CONFIG.SESSION_TIMEOUT_MS
    )
    
    // Find or create current session
    let currentSession = usage.sessions.find(s => 
      now.getTime() - s.lastActivityAt.getTime() < RATE_LIMIT_CONFIG.SESSION_TIMEOUT_MS
    )
    
    const sessionsUsed = usage.sessions.length
    const tokensUsed = usage.totalTokens
    const estimatedCost = usage.estimatedCost
    
    // Check daily session limit
    if (!currentSession && sessionsUsed >= RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT) {
      return {
        allowed: false,
        reason: 'session_limit',
        sessionsUsed,
        sessionsRemaining: 0,
        tokensUsed,
        tokensRemaining: 0,
        estimatedCost,
        resetTime: this.getNextResetTime()
      }
    }
    
    // Check cost limit
    if (estimatedCost >= RATE_LIMIT_CONFIG.DAILY_COST_LIMIT) {
      return {
        allowed: false,
        reason: 'cost_limit',
        sessionsUsed,
        sessionsRemaining: Math.max(0, RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT - sessionsUsed),
        tokensUsed,
        tokensRemaining: 0,
        estimatedCost,
        resetTime: this.getNextResetTime()
      }
    }
    
    // Create new session if needed
    if (!currentSession) {
      currentSession = {
        id: crypto.randomUUID(),
        ip,
        startedAt: now,
        lastActivityAt: now,
        tokensUsed: 0,
        messageCount: 0
      }
      usage.sessions.push(currentSession)
    }
    
    // Check session token limit
    const sessionTokensRemaining = RATE_LIMIT_CONFIG.SESSION_TOKEN_LIMIT - currentSession.tokensUsed
    if (sessionTokensRemaining <= 0) {
      return {
        allowed: false,
        reason: 'token_limit',
        sessionsUsed,
        sessionsRemaining: Math.max(0, RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT - sessionsUsed),
        tokensUsed: currentSession.tokensUsed,
        tokensRemaining: 0,
        estimatedCost,
        resetTime: this.getNextResetTime(),
        currentSessionId: currentSession.id
      }
    }
    
    return {
      allowed: true,
      reason: 'ok',
      sessionsUsed,
      sessionsRemaining: Math.max(0, RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT - sessionsUsed),
      tokensUsed: currentSession.tokensUsed,
      tokensRemaining: sessionTokensRemaining,
      estimatedCost,
      resetTime: this.getNextResetTime(),
      currentSessionId: currentSession.id
    }
  }
  
  /**
   * Records token usage for the current session
   */
  async recordUsage(tokens: number, sessionId?: string): Promise<void> {
    const ip = await this.getClientIP()
    const usage = this.getDailyUsage(ip)
    const now = new Date()
    
    // Find the session
    const session = sessionId 
      ? usage.sessions.find(s => s.id === sessionId)
      : usage.sessions.find(s => 
          now.getTime() - s.lastActivityAt.getTime() < RATE_LIMIT_CONFIG.SESSION_TIMEOUT_MS
        )
    
    if (session) {
      session.tokensUsed += tokens
      session.lastActivityAt = now
      session.messageCount += 1
      
      // Update daily totals
      usage.totalTokens += tokens
      usage.estimatedCost += tokens * RATE_LIMIT_CONFIG.ESTIMATED_COST_PER_TOKEN
      
      // Save updated usage
      const today = this.getCurrentDateUTC()
      const key = `${ip}:${today}`
      rateLimitStore.set(key, usage)
    }
  }
  
  /**
   * Gets detailed usage statistics for monitoring
   */
  async getUsageStats(): Promise<{
    ip: string
    today: DailyUsage
    resetTime: Date
  }> {
    const ip = await this.getClientIP()
    const usage = this.getDailyUsage(ip)
    
    return {
      ip,
      today: usage,
      resetTime: this.getNextResetTime()
    }
  }
  
  /**
   * Formats rate limit headers for HTTP response
   */
  getRateLimitHeaders(status: RateLimitStatus): Record<string, string> {
    return {
      'X-RateLimit-Limit': RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT.toString(),
      'X-RateLimit-Remaining': status.sessionsRemaining.toString(),
      'X-RateLimit-Reset': status.resetTime.toISOString(),
      'X-RateLimit-Used': status.sessionsUsed.toString(),
    }
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService()

// Export configuration for use in other modules
export { RATE_LIMIT_CONFIG }