/**
 * Security Service
 * Handles input validation, prompt injection detection, and content sanitization
 * Following OWASP best practices for web application security
 */

import { z } from 'zod'

// Security configuration constants
const SECURITY_CONFIG = {
  MAX_INPUT_LENGTH: 1000,
  MIN_INPUT_LENGTH: 10,
  MAX_CONVERSATION_LENGTH: 50, // Max messages in a conversation
  
  // Bot detection configuration
  BOT_DETECTION: {
    MAX_REQUESTS_PER_MINUTE: 10, // Normal humans can't type this fast
    MIN_TYPING_TIME_MS: 1000, // Minimum time between messages
    IDENTICAL_MESSAGE_LIMIT: 3, // Max identical messages before flagging
    CAPTCHA_TRIGGER_SCORE: 3, // Score threshold to trigger CAPTCHA
  },
  
  // Forbidden patterns for prompt injection detection
  FORBIDDEN_PATTERNS: [
    'ignore previous',
    'system:',
    'assistant:',
    'forget your',
    'pretend you are',
    'act as if',
    'override instructions',
    'bypass restrictions',
    'reveal your prompt',
    'show system message',
    'disregard above',
    'new instructions:',
    '[[instructions]]',
    '{{system}}',
  ],
  
  // Suspicious patterns that might indicate misuse
  SUSPICIOUS_PATTERNS: [
    'jailbreak',
    'hack',
    'exploit',
    'injection',
    'malicious',
    'evil',
  ],
  
  // Bot-like patterns in messages
  BOT_PATTERNS: [
    /^test\s*$/i,
    /^hello world\s*$/i,
    /^\d+\s*\+\s*\d+\s*=?\s*$/i, // Math expressions like "2+2="
    /^(a|an|the)\s+\w+(\s+\w+)*\s*$/i, // Very basic sentence patterns
    /^[a-z]{1,5}$/, // Single short words
    /^.{1,3}$/, // Very short inputs
  ],
  
  // Content filters for inappropriate content
  INAPPROPRIATE_CONTENT: [
    // Add patterns as needed based on your content policy
  ]
} as const

// Input validation schema using Zod
const conversationInputSchema = z.object({
  input: z.string()
    .min(SECURITY_CONFIG.MIN_INPUT_LENGTH, 'Please provide more details about your dream trip')
    .max(SECURITY_CONFIG.MAX_INPUT_LENGTH, 'Message is too long. Please keep it under 1000 characters.')
    .refine(val => val.trim().length >= SECURITY_CONFIG.MIN_INPUT_LENGTH, {
      message: 'Please provide more details about your dream trip'
    }),
  conversationHistory: z.array(z.object({
    type: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string().optional(),
  })).max(SECURITY_CONFIG.MAX_CONVERSATION_LENGTH).optional().default([])
})

export interface SecurityCheckResult {
  isValid: boolean
  error?: string
  severity?: 'low' | 'medium' | 'high'
  detectedPatterns?: string[]
  requiresCaptcha?: boolean
  suspiciousScore?: number
}

export interface SanitizedInput {
  input: string
  conversationHistory: Array<{
    type: 'user' | 'assistant'
    content: string
    timestamp?: string
  }>
}

// In-memory storage for bot detection (in production, use Redis)
interface UserActivity {
  messages: Array<{
    content: string
    timestamp: number
  }>
  requestTimes: number[]
  suspiciousScore: number
  lastCaptchaTime?: number
}

const userActivityStore = new Map<string, UserActivity>()

class SecurityService {
  /**
   * Gets user ID from IP address (in production, could include session info)
   */
  private getUserId(ip?: string): string {
    // In production, you might combine IP with session ID for better tracking
    return ip || 'unknown'
  }

  /**
   * Gets or creates user activity record
   */
  private getUserActivity(userId: string): UserActivity {
    if (!userActivityStore.has(userId)) {
      userActivityStore.set(userId, {
        messages: [],
        requestTimes: [],
        suspiciousScore: 0
      })
    }
    return userActivityStore.get(userId)!
  }

  /**
   * Cleans old activity data (older than 1 hour)
   */
  private cleanOldActivity(activity: UserActivity) {
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    activity.messages = activity.messages.filter(msg => msg.timestamp > oneHourAgo)
    activity.requestTimes = activity.requestTimes.filter(time => time > oneHourAgo)
  }

  /**
   * Analyzes message for bot-like patterns
   */
  private analyzeBotPatterns(message: string): number {
    let score = 0
    
    // Check for bot-like patterns
    for (const pattern of SECURITY_CONFIG.BOT_PATTERNS) {
      if (pattern.test(message)) {
        score += 2
      }
    }
    
    // Very short messages are suspicious
    if (message.trim().length < 5) {
      score += 1
    }
    
    // All caps messages
    if (message === message.toUpperCase() && message.length > 10) {
      score += 1
    }
    
    // Repeated characters
    if (/(.)\1{4,}/.test(message)) {
      score += 1
    }
    
    return score
  }

  /**
   * Comprehensive bot detection analysis
   */
  private detectBotBehavior(message: string, userId: string): SecurityCheckResult {
    const activity = this.getUserActivity(userId)
    this.cleanOldActivity(activity)
    
    const now = Date.now()
    let suspiciousScore = activity.suspiciousScore

    // Check request frequency
    activity.requestTimes.push(now)
    const recentRequests = activity.requestTimes.filter(time => 
      now - time < 60 * 1000 // Last minute
    )
    
    if (recentRequests.length > SECURITY_CONFIG.BOT_DETECTION.MAX_REQUESTS_PER_MINUTE) {
      suspiciousScore += 3
    }

    // Check for rapid-fire requests
    if (activity.requestTimes.length >= 2) {
      const timeBetweenRequests = now - activity.requestTimes[activity.requestTimes.length - 2]
      if (timeBetweenRequests < SECURITY_CONFIG.BOT_DETECTION.MIN_TYPING_TIME_MS) {
        suspiciousScore += 2
      }
    }

    // Check for identical messages
    const identicalCount = activity.messages.filter(msg => 
      msg.content === message
    ).length
    
    if (identicalCount >= SECURITY_CONFIG.BOT_DETECTION.IDENTICAL_MESSAGE_LIMIT) {
      suspiciousScore += 4
    }

    // Analyze message content for bot patterns
    const botPatternScore = this.analyzeBotPatterns(message)
    suspiciousScore += botPatternScore

    // Add message to history
    activity.messages.push({ content: message, timestamp: now })
    activity.suspiciousScore = suspiciousScore

    // Decay score over time (if no activity for 30 minutes, reduce score)
    const lastActivity = Math.max(
      activity.messages[activity.messages.length - 1]?.timestamp || 0,
      activity.requestTimes[activity.requestTimes.length - 1] || 0
    )
    
    const timeSinceLastActivity = now - lastActivity
    if (timeSinceLastActivity > 30 * 60 * 1000) { // 30 minutes
      activity.suspiciousScore = Math.max(0, activity.suspiciousScore - 1)
    }

    // Update the store
    userActivityStore.set(userId, activity)

    // Determine if CAPTCHA is required
    const requiresCaptcha = suspiciousScore >= SECURITY_CONFIG.BOT_DETECTION.CAPTCHA_TRIGGER_SCORE
    
    // If CAPTCHA was recently solved, don't require it again immediately
    if (requiresCaptcha && activity.lastCaptchaTime) {
      const timeSinceCaptcha = now - activity.lastCaptchaTime
      if (timeSinceCaptcha < 10 * 60 * 1000) { // 10 minutes
        return {
          isValid: true,
          requiresCaptcha: false,
          suspiciousScore
        }
      }
    }

    return {
      isValid: !requiresCaptcha, // Invalid if CAPTCHA is required but not provided
      requiresCaptcha,
      suspiciousScore,
      severity: requiresCaptcha ? 'medium' : 'low',
      error: requiresCaptcha ? 'Please complete the security verification to continue.' : undefined
    }
  }

  /**
   * Verifies CAPTCHA token with Google's API
   */
  async verifyCaptchaToken(token: string): Promise<boolean> {
    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.warn('CAPTCHA secret key not configured')
      return true // Allow in development if not configured
    }

    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`
      })

      const data = await response.json()
      return data.success === true
    } catch (error) {
      console.error('CAPTCHA verification error:', error)
      return false
    }
  }

  /**
   * Records successful CAPTCHA completion
   */
  recordCaptchaSuccess(userId: string) {
    const activity = this.getUserActivity(userId)
    activity.lastCaptchaTime = Date.now()
    activity.suspiciousScore = Math.max(0, activity.suspiciousScore - 2) // Reduce suspicion
    userActivityStore.set(userId, activity)
  }

  /**
   * Performs comprehensive security validation on user input
   */
  async validateInput(rawInput: unknown, ip?: string, captchaToken?: string): Promise<SecurityCheckResult> {
    try {
      // First, parse with Zod schema
      const parsed = conversationInputSchema.parse(rawInput)
      
      const userId = this.getUserId(ip)
      
      // Check for bot behavior first
      const botCheck = this.detectBotBehavior(parsed.input, userId)
      if (botCheck.requiresCaptcha && !captchaToken) {
        return botCheck
      }
      
      // If CAPTCHA token provided, validate it
      if (captchaToken) {
        const isValidCaptcha = await this.verifyCaptchaToken(captchaToken)
        if (!isValidCaptcha) {
          return {
            isValid: false,
            error: 'Invalid security verification. Please try again.',
            severity: 'medium',
            requiresCaptcha: true
          }
        }
        // Record successful CAPTCHA completion
        this.recordCaptchaSuccess(userId)
      }
      
      // Check for prompt injection patterns
      const injectionCheck = this.detectPromptInjection(parsed.input)
      if (!injectionCheck.isValid) {
        return injectionCheck
      }
      
      // Check conversation history for injection attempts
      for (const message of parsed.conversationHistory) {
        const historyCheck = this.detectPromptInjection(message.content)
        if (!historyCheck.isValid) {
          return {
            isValid: false,
            error: 'Invalid content detected in conversation history',
            severity: historyCheck.severity
          }
        }
      }
      
      // Return success with bot analysis info
      return { 
        isValid: true,
        requiresCaptcha: false,
        suspiciousScore: botCheck.suspiciousScore
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || 'Invalid input provided',
          severity: 'low'
        }
      }
      
      return {
        isValid: false,
        error: 'Invalid input format',
        severity: 'medium'
      }
    }
  }
  
  /**
   * Detects potential prompt injection attempts
   */
  private detectPromptInjection(input: string): SecurityCheckResult {
    const lowerInput = input.toLowerCase()
    const detectedPatterns: string[] = []
    
    // Check for forbidden patterns (high severity)
    for (const pattern of SECURITY_CONFIG.FORBIDDEN_PATTERNS) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        detectedPatterns.push(pattern)
      }
    }
    
    if (detectedPatterns.length > 0) {
      return {
        isValid: false,
        error: 'Please focus on travel planning questions only.',
        severity: 'high',
        detectedPatterns
      }
    }
    
    // Check for suspicious patterns (medium severity)
    const suspiciousPatterns: string[] = []
    for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        suspiciousPatterns.push(pattern)
      }
    }
    
    if (suspiciousPatterns.length >= 2) {
      return {
        isValid: false,
        error: 'Your message contains suspicious content. Please rephrase your travel query.',
        severity: 'medium',
        detectedPatterns: suspiciousPatterns
      }
    }
    
    return { isValid: true }
  }
  
  /**
   * Sanitizes input, returning clean data (validation should be done separately)
   */
  sanitizeInput(rawInput: unknown): SanitizedInput | null {
    try {
      // Parse to get clean data
      const parsed = conversationInputSchema.parse(rawInput)
      
      // Additional sanitization
      return {
        input: this.sanitizeText(parsed.input),
        conversationHistory: parsed.conversationHistory.map(msg => ({
          ...msg,
          content: this.sanitizeText(msg.content)
        }))
      }
    } catch (error) {
      console.error('Sanitization parsing error:', error)
      return null
    }
  }
  
  /**
   * Basic text sanitization
   */
  private sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH) // Enforce max length
  }
  
  /**
   * Logs security events for monitoring
   */
  logSecurityEvent(event: {
    type: 'prompt_injection' | 'rate_limit' | 'validation_failure'
    severity: 'low' | 'medium' | 'high'
    details?: any
    ip?: string
  }) {
    // In production, this would send to a security monitoring service
    console.warn('[SECURITY EVENT]', {
      timestamp: new Date().toISOString(),
      ...event
    })
  }
}

// Export singleton instance
export const securityService = new SecurityService()

// Export types and constants for use in other modules
export { SECURITY_CONFIG }