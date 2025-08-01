// Mock Next.js modules
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((body, init?) => ({
      ...init,
      body,
      json: async () => body
    }))
  }
}))

// Mock all service dependencies
jest.mock('@/services/rateLimitService', () => ({
  rateLimitService: {
    checkRateLimit: jest.fn(),
    getRateLimitHeaders: jest.fn(),
    recordUsage: jest.fn()
  }
}))

jest.mock('@/services/securityService', () => ({
  securityService: {
    validateInput: jest.fn(),
    sanitizeInput: jest.fn(),
    logSecurityEvent: jest.fn()
  }
}))

jest.mock('@/services/apiUsageService', () => ({
  apiUsageService: {
    recordAPICall: jest.fn()
  }
}))

jest.mock('@/services/aiAnalysisService', () => ({
  analyzeUserInputWithAI: jest.fn(),
  hasEnoughInfoForRecommendationsAI: jest.fn()
}))

jest.mock('@/services/clarificationService', () => ({
  generateClarificationQuestions: jest.fn()
}))

jest.mock('@/lib/ai/gemini', () => ({
  queryGeminiAI: jest.fn(),
  validateGeminiSetup: jest.fn()
}))

jest.mock('@/services/realDataService', () => ({
  realDataService: {
    enhanceMultipleTrips: jest.fn()
  }
}))

// Mock console methods to reduce test noise
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

// Import the route handler after all mocks are set up
import { POST, GET } from '@/app/api/conversation/route'
import { NextRequest } from 'next/server'

// Import mocked services to access their mock implementations
import { rateLimitService } from '@/services/rateLimitService'
import { securityService } from '@/services/securityService'
import { apiUsageService } from '@/services/apiUsageService'
import { analyzeUserInputWithAI, hasEnoughInfoForRecommendationsAI } from '@/services/aiAnalysisService'
import { generateClarificationQuestions } from '@/services/clarificationService'
import { queryGeminiAI, validateGeminiSetup } from '@/lib/ai/gemini'
import { realDataService } from '@/services/realDataService'

// Create type-safe mocks
const mockRateLimitService = rateLimitService as jest.Mocked<typeof rateLimitService>
const mockSecurityService = securityService as jest.Mocked<typeof securityService>
const mockApiUsageService = apiUsageService as jest.Mocked<typeof apiUsageService>
const mockAnalyzeUserInputWithAI = analyzeUserInputWithAI as jest.MockedFunction<typeof analyzeUserInputWithAI>
const mockHasEnoughInfoForRecommendationsAI = hasEnoughInfoForRecommendationsAI as jest.MockedFunction<typeof hasEnoughInfoForRecommendationsAI>
const mockGenerateClarificationQuestions = generateClarificationQuestions as jest.MockedFunction<typeof generateClarificationQuestions>
const mockQueryGeminiAI = queryGeminiAI as jest.MockedFunction<typeof queryGeminiAI>
const mockValidateGeminiSetup = validateGeminiSetup as jest.MockedFunction<typeof validateGeminiSetup>
const mockRealDataService = realDataService as jest.Mocked<typeof realDataService>

describe('/api/conversation', () => {
  // Helper function to create mock request
  const createMockRequest = (body: any, headers: Record<string, string> = {}) => {
    const request = {
      json: jest.fn().mockResolvedValue(body),
      headers: new Map(Object.entries(headers)),
      ip: '127.0.0.1'
    } as unknown as NextRequest
    
    return request
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up default mock implementations
    mockRateLimitService.checkRateLimit.mockResolvedValue({
      allowed: true,
      sessionsUsed: 1,
      sessionsRemaining: 4,
      tokensUsed: 100,
      tokensRemaining: 2400,
      resetTime: new Date(),
      currentSessionId: 'test-session-id'
    })
    
    mockRateLimitService.getRateLimitHeaders.mockReturnValue({
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': '4',
      'X-RateLimit-Reset': new Date().toISOString(),
      'X-RateLimit-Used': '1'
    })
    
    mockValidateGeminiSetup.mockReturnValue({ isValid: true })
    
    mockSecurityService.validateInput.mockResolvedValue({
      isValid: true
    })
    
    mockSecurityService.sanitizeInput.mockImplementation((body) => ({
      input: body.input,
      conversationHistory: body.conversationHistory || []
    }))
    
    mockAnalyzeUserInputWithAI.mockResolvedValue({
      userIntent: {
        destinations: ['Paris'],
        keywords: ['romantic', 'budget'],
        ambiguityLevel: 'clear',
        tripTypeHint: 'single'
      },
      extractedInfo: {
        duration: 7,
        budget: 2000
      },
      travelRelevance: 'travel_related'
    })
    
    mockHasEnoughInfoForRecommendationsAI.mockReturnValue(true)
    
    mockQueryGeminiAI.mockResolvedValue({
      chatMessage: 'Here are some great trips to Paris!',
      recommendations: {
        trips: [{
          tripId: 'paris-romantic',
          destination: 'Paris',
          duration: 7,
          estimatedCost: 1800,
          highlights: ['Eiffel Tower', 'Louvre'],
          description: 'A romantic week in Paris',
          activities: ['Sightseeing', 'Dining'],
          season: 'spring',
          kidFriendly: false,
          customizations: {},
          score: 90,
          type: 'single'
        }]
      },
      followUpQuestions: ['Would you like hotel recommendations?']
    })
    
    mockRealDataService.enhanceMultipleTrips.mockImplementation((trips) => trips)
  })

  afterAll(() => {
    mockConsoleLog.mockRestore()
    mockConsoleError.mockRestore()
    mockConsoleWarn.mockRestore()
  })

  describe('POST /api/conversation', () => {
    it('should handle successful travel query', async () => {
      const request = createMockRequest({
        input: 'I want to visit Paris on a budget',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.message).toBe('Here are some great trips to Paris!')
      expect(data.data.recommendations).toHaveLength(1)
      expect(data.data.recommendations[0].destination).toBe('Paris')
      expect(mockRateLimitService.recordUsage).toHaveBeenCalled()
    })

    it('should handle rate limit exceeded', async () => {
      mockRateLimitService.checkRateLimit.mockResolvedValue({
        allowed: false,
        reason: 'session_limit',
        sessionsUsed: 5,
        sessionsRemaining: 0,
        tokensUsed: 0,
        tokensRemaining: 0,
        resetTime: new Date()
      })

      const request = createMockRequest({
        input: 'Plan a trip',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toBe('RATE_LIMIT_EXCEEDED')
      expect(data.message).toContain('daily conversation limit')
      expect(mockSecurityService.logSecurityEvent).toHaveBeenCalledWith({
        type: 'rate_limit',
        severity: 'low',
        details: { reason: 'session_limit' }
      })
    })

    it('should handle invalid Gemini setup', async () => {
      mockValidateGeminiSetup.mockReturnValue({ 
        isValid: false, 
        error: 'API key missing' 
      })

      const request = createMockRequest({
        input: 'Plan a trip',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('AI service is temporarily unavailable')
    })

    it('should handle security validation failure', async () => {
      mockSecurityService.validateInput.mockResolvedValue({
        isValid: false,
        error: 'Suspicious input detected',
        severity: 'high',
        detectedPatterns: ['injection attempt']
      })

      const request = createMockRequest({
        input: 'DROP TABLE users;',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('INVALID_INPUT')
      expect(mockSecurityService.logSecurityEvent).toHaveBeenCalled()
    })

    it('should handle CAPTCHA requirement', async () => {
      mockSecurityService.validateInput.mockResolvedValue({
        isValid: false,
        requiresCaptcha: true,
        error: 'Too many requests, please verify',
        severity: 'medium'
      })

      const request = createMockRequest({
        input: 'Plan a trip',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toBe('CAPTCHA_REQUIRED')
      expect(data.requiresCaptcha).toBe(true)
    })

    it('should handle non-travel questions', async () => {
      mockAnalyzeUserInputWithAI.mockResolvedValue({
        travelRelevance: 'non_travel',
        userIntent: {}
      })

      const request = createMockRequest({
        input: 'What is the capital of France?',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.message).toContain('travel')
      expect(data.message).toContain('help')
      expect(data.data.recommendations).toEqual([])
      expect(data.data.followUpQuestions).toContain('Plan a beach vacation')
    })

    it('should handle travel-adjacent questions', async () => {
      mockAnalyzeUserInputWithAI.mockResolvedValue({
        travelRelevance: 'travel_adjacent',
        userIntent: {}
      })

      const request = createMockRequest({
        input: 'Tell me about French culture',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.message).toContain('interesting question')
      expect(data.message).toContain('visiting there')
    })

    it('should generate clarification questions when info is insufficient', async () => {
      mockHasEnoughInfoForRecommendationsAI.mockReturnValue(false)
      mockGenerateClarificationQuestions.mockReturnValue([
        {
          id: 'duration-001',
          text: 'How many days are you planning to travel?',
          type: 'duration',
          options: ['3-4 days', '5-7 days', '1-2 weeks']
        }
      ])

      const request = createMockRequest({
        input: 'I want to travel somewhere warm',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.clarificationNeeded).toBe(true)
      expect(data.clarificationQuestions).toHaveLength(1)
      expect(data.clarificationQuestions[0].text).toContain('How many days')
    })

    it('should handle AI analysis failure', async () => {
      mockAnalyzeUserInputWithAI.mockRejectedValue(new Error('AI service error'))

      const request = createMockRequest({
        input: 'Plan a trip to Paris',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.success).toBe(false)
      expect(data.error).toBe('AI_ANALYSIS_FAILED')
      expect(data.message).toContain('trouble analyzing')
    })

    it('should handle Gemini AI query failure', async () => {
      mockQueryGeminiAI.mockRejectedValue(new Error('Gemini API error'))

      const request = createMockRequest({
        input: 'Plan a trip to Paris',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('SERVICE_UNAVAILABLE')
      expect(mockApiUsageService.recordAPICall).toHaveBeenCalledWith(
        'gemini',
        expect.any(Number),
        true
      )
    })

    it('should enhance trips with real data when available', async () => {
      const enhancedTrip = {
        tripId: 'paris-romantic',
        destination: 'Paris',
        duration: 7,
        estimatedCost: 1800,
        highlights: ['Eiffel Tower', 'Louvre', 'Seine River'],
        description: 'A romantic week in Paris with real data',
        activities: ['Sightseeing', 'Dining', 'River Cruise'],
        season: 'spring',
        kidFriendly: false,
        customizations: { weather: 'sunny' },
        score: 95,
        type: 'single'
      }

      mockRealDataService.enhanceMultipleTrips.mockResolvedValue([enhancedTrip])

      const request = createMockRequest({
        input: 'Plan a romantic trip to Paris',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(mockRealDataService.enhanceMultipleTrips).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          includeWeather: true,
          includeAttractions: true,
          includeFlights: true,
          includeHotels: true,
          maxAttractions: 5
        })
      )
      expect(data.data.recommendations[0]).toEqual(enhancedTrip)
    })

    it('should continue with mock data if real data enhancement fails', async () => {
      mockRealDataService.enhanceMultipleTrips.mockRejectedValue(new Error('API error'))

      const request = createMockRequest({
        input: 'Plan a trip to Paris',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.recommendations).toHaveLength(1)
      expect(data.data.recommendations[0].destination).toBe('Paris')
    })

    it('should track token usage correctly', async () => {
      const request = createMockRequest({
        input: 'Plan a trip to Paris',
        conversationHistory: [
          { role: 'user', content: 'I have $2000 budget' },
          { role: 'assistant', content: 'Great! Let me help you plan.' }
        ]
      })

      await POST(request)

      // Verify token calculation and recording
      expect(mockRateLimitService.recordUsage).toHaveBeenCalledWith(
        expect.any(Number),
        'test-session-id'
      )
      
      expect(mockApiUsageService.recordAPICall).toHaveBeenCalledWith(
        'gemini',
        expect.any(Number),
        false,
        expect.objectContaining({ tokens: expect.any(Number) })
      )
    })

    it('should include rate limit info in response', async () => {
      const request = createMockRequest({
        input: 'Plan a trip',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.rateLimitInfo).toBeDefined()
      expect(data.rateLimitInfo.sessionsUsed).toBe(1)
      expect(data.rateLimitInfo.sessionsRemaining).toBe(4)
      expect(data.rateLimitInfo.tokensUsed).toBe(100)
      expect(data.rateLimitInfo.tokensRemaining).toBe(2400)
    })

    it('should handle empty recommendations from AI', async () => {
      mockQueryGeminiAI.mockResolvedValue({
        chatMessage: 'I need more information to help you.',
        recommendations: { trips: [] },
        followUpQuestions: ['Where would you like to go?']
      })

      const request = createMockRequest({
        input: 'Plan a trip',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.recommendations).toEqual([])
      expect(mockRealDataService.enhanceMultipleTrips).not.toHaveBeenCalled()
    })

    it('should handle sanitization failure', async () => {
      mockSecurityService.sanitizeInput.mockReturnValue(null)

      const request = createMockRequest({
        input: '<script>alert("xss")</script>',
        conversationHistory: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('INVALID_INPUT')
    })
  })

  describe('GET /api/conversation', () => {
    it('should return method not allowed', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data.error).toBe('Method not allowed')
    })
  })
})