// Mock Next.js headers first
const mockHeaders = jest.fn()
jest.mock('next/headers', () => ({
  headers: () => mockHeaders(),
}))

// Then import the service
import { rateLimitService, RATE_LIMIT_CONFIG } from '../../src/services/rateLimitService'

describe('RateLimitService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock headers to return a test IP
    mockHeaders.mockReturnValue(new Map([
      ['x-forwarded-for', '192.168.1.100'],
    ]))
    
    // Mock current time for consistent tests
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('checkRateLimit', () => {
    it('should provide rate limit information', async () => {
      const status = await rateLimitService.checkRateLimit()
      
      expect(status).toHaveProperty('allowed')
      expect(status).toHaveProperty('sessionsUsed')
      expect(status).toHaveProperty('sessionsRemaining')
      expect(status).toHaveProperty('tokensUsed')
      expect(status).toHaveProperty('tokensRemaining')
      expect(status).toHaveProperty('estimatedCost')
      expect(status).toHaveProperty('resetTime')
      expect(status.resetTime).toBeInstanceOf(Date)
      
      expect(typeof status.allowed).toBe('boolean')
      expect(typeof status.sessionsUsed).toBe('number')
      expect(typeof status.sessionsRemaining).toBe('number')
      expect(typeof status.tokensUsed).toBe('number')
      expect(typeof status.tokensRemaining).toBe('number')
      expect(typeof status.estimatedCost).toBe('number')
    })

    it('should calculate cost properly', async () => {
      const status = await rateLimitService.checkRateLimit(1000) // 1000 tokens
      
      expect(status.allowed).toBe(true)
      expect(typeof status.estimatedCost).toBe('number')
      expect(status.estimatedCost).toBeGreaterThanOrEqual(0)
    })

    it('should respect session limits', async () => {
      const status = await rateLimitService.checkRateLimit()
      
      expect(status.sessionsRemaining).toBeLessThanOrEqual(RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT)
      expect(status.sessionsUsed + status.sessionsRemaining).toBeLessThanOrEqual(RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT)
    })

    it('should respect token limits per session', async () => {
      const status = await rateLimitService.checkRateLimit()
      
      expect(status.tokensRemaining).toBeLessThanOrEqual(RATE_LIMIT_CONFIG.SESSION_TOKEN_LIMIT)
      expect(status.tokensUsed + status.tokensRemaining).toBeLessThanOrEqual(RATE_LIMIT_CONFIG.SESSION_TOKEN_LIMIT)
    })
  })

  describe('recordUsage', () => {
    it('should record token usage', async () => {
      // First check should create a session
      const initialStatus = await rateLimitService.checkRateLimit()
      const initialTokensUsed = initialStatus.tokensUsed
      
      // Record some usage
      await rateLimitService.recordUsage(500)
      
      // Check that usage was recorded
      const updatedStatus = await rateLimitService.checkRateLimit()
      expect(updatedStatus.tokensUsed).toBe(initialTokensUsed + 500)
      expect(updatedStatus.tokensRemaining).toBe(initialStatus.tokensRemaining - 500)
    })

    it('should accumulate token usage across multiple calls', async () => {
      // Initialize session
      await rateLimitService.checkRateLimit()
      
      // Record usage in multiple calls
      await rateLimitService.recordUsage(300)
      await rateLimitService.recordUsage(200)
      
      const status = await rateLimitService.checkRateLimit()
      expect(status.tokensUsed).toBeGreaterThanOrEqual(500)
    })

    it('should update estimated cost', async () => {
      const initialStatus = await rateLimitService.checkRateLimit()
      const initialCost = initialStatus.estimatedCost
      
      await rateLimitService.recordUsage(1000)
      
      const updatedStatus = await rateLimitService.checkRateLimit()
      expect(updatedStatus.estimatedCost).toBeGreaterThan(initialCost)
    })
  })

  describe('getUsageStats', () => {
    it('should return usage statistics with correct structure', async () => {
      const stats = await rateLimitService.getUsageStats()
      
      expect(stats).toHaveProperty('ip')
      expect(stats).toHaveProperty('today')
      expect(stats).toHaveProperty('resetTime')
      
      expect(typeof stats.ip).toBe('string')
      expect(stats.today).toHaveProperty('date')
      expect(stats.today).toHaveProperty('sessions')
      expect(stats.today).toHaveProperty('totalTokens')
      expect(stats.today).toHaveProperty('estimatedCost')
      expect(stats.resetTime).toBeInstanceOf(Date)
      
      expect(Array.isArray(stats.today.sessions)).toBe(true)
      expect(typeof stats.today.totalTokens).toBe('number')
      expect(typeof stats.today.estimatedCost).toBe('number')
    })

    it('should track daily usage correctly', async () => {
      // Generate some usage
      await rateLimitService.checkRateLimit()
      await rateLimitService.recordUsage(750)
      
      const stats = await rateLimitService.getUsageStats()
      
      expect(stats.today.totalTokens).toBeGreaterThanOrEqual(750)
      expect(stats.today.estimatedCost).toBeGreaterThan(0)
      expect(stats.today.sessions.length).toBeGreaterThan(0)
    })
  })

  describe('IP handling', () => {
    it('should handle x-forwarded-for header', async () => {
      mockHeaders.mockReturnValue(new Map([
        ['x-forwarded-for', '203.0.113.195, 70.41.3.18, 150.172.238.178'],
      ]))
      
      const stats = await rateLimitService.getUsageStats()
      expect(stats.ip).toBe('203.0.113.195') // Should use first IP
    })

    it('should handle x-real-ip header as fallback', async () => {
      mockHeaders.mockReturnValue(new Map([
        ['x-real-ip', '203.0.113.195'],
      ]))
      
      const stats = await rateLimitService.getUsageStats()
      expect(stats.ip).toBe('203.0.113.195')
    })

    it('should use default IP if no headers available', async () => {
      mockHeaders.mockReturnValue(new Map())
      
      const stats = await rateLimitService.getUsageStats()
      expect(stats.ip).toBe('127.0.0.1') // Default fallback
    })
  })

  describe('rate limit headers', () => {
    it('should format rate limit headers correctly', async () => {
      const status = await rateLimitService.checkRateLimit()
      const headers = rateLimitService.getRateLimitHeaders(status)
      
      expect(headers).toHaveProperty('X-RateLimit-Limit')
      expect(headers).toHaveProperty('X-RateLimit-Remaining')
      expect(headers).toHaveProperty('X-RateLimit-Reset')
      expect(headers).toHaveProperty('X-RateLimit-Used')
      
      expect(headers['X-RateLimit-Limit']).toBe(RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT.toString())
      expect(headers['X-RateLimit-Remaining']).toBe(status.sessionsRemaining.toString())
      expect(headers['X-RateLimit-Used']).toBe(status.sessionsUsed.toString())
      expect(headers['X-RateLimit-Reset']).toBe(status.resetTime.toISOString())
    })
  })

  describe('configuration', () => {
    it('should export rate limit configuration', () => {
      expect(RATE_LIMIT_CONFIG).toBeDefined()
      expect(RATE_LIMIT_CONFIG.DAILY_SESSION_LIMIT).toBe(5)
      expect(RATE_LIMIT_CONFIG.SESSION_TOKEN_LIMIT).toBe(2500)
      expect(RATE_LIMIT_CONFIG.DAILY_COST_LIMIT).toBe(5.00)
      expect(typeof RATE_LIMIT_CONFIG.ESTIMATED_COST_PER_TOKEN).toBe('number')
    })
  })

  describe('daily reset', () => {
    it('should calculate reset time for next day', async () => {
      const status = await rateLimitService.checkRateLimit()
      
      expect(status.resetTime).toBeInstanceOf(Date)
      expect(status.resetTime.getTime()).toBeGreaterThan(Date.now())
      
      // Should be midnight of next day
      const resetTime = status.resetTime
      expect(resetTime.getUTCHours()).toBe(0)
      expect(resetTime.getUTCMinutes()).toBe(0)
      expect(resetTime.getUTCSeconds()).toBe(0)
    })

    it('should reset usage for new day', async () => {
      // Use some resources today
      await rateLimitService.checkRateLimit()
      await rateLimitService.recordUsage(1000)
      
      const todaysStats = await rateLimitService.getUsageStats()
      expect(todaysStats.today.totalTokens).toBeGreaterThan(0)
      
      // Move to next day
      jest.setSystemTime(new Date('2024-01-16T12:00:00Z'))
      
      const tomorrowsStats = await rateLimitService.getUsageStats()
      expect(tomorrowsStats.today.date).toBe('2024-01-16')
      expect(tomorrowsStats.today.totalTokens).toBe(0)
      expect(tomorrowsStats.today.sessions).toHaveLength(0)
    })
  })
})