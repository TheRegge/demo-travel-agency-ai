import { conversationService } from '../../src/services/conversationService'
import { mockAIResponse, mockConversationContext } from '../utils/mockData'

// Mock fetch for API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock contextStorageService
jest.mock('../../src/services/contextStorageService', () => ({
  contextStorage: {
    loadContext: jest.fn(() => null),
    saveContext: jest.fn(),
    updateContextPreferences: jest.fn(),
    clearContext: jest.fn(),
  }
}))

// Mock clarificationService
jest.mock('../../src/services/clarificationService', () => ({
  generateClarificationQuestions: jest.fn(() => []),
  generateContextAwareClarificationQuestions: jest.fn(() => []),
  updateContextWithClarification: jest.fn(),
  detectContextModifications: jest.fn(() => []),
}))

// Mock console.log to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation()
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

describe('conversationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockConsoleLog.mockRestore()
    mockConsoleError.mockRestore()
  })

  describe('getResponse', () => {
    it('should successfully get AI response', async () => {
      const mockResponse = {
        success: true,
        data: mockAIResponse,
        message: 'Success'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      const result = await conversationService.getResponse(
        'I want to plan a romantic trip to Paris',
        [],
        mockConversationContext
      )

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockAIResponse)
      expect(result.message).toBe('Success')

      expect(mockFetch).toHaveBeenCalledWith('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: 'I want to plan a romantic trip to Paris',
          conversationHistory: [],
          context: mockConversationContext,
          captchaToken: undefined
        })
      })
    })

    it('should handle API errors gracefully', async () => {
      const mockErrorResponse = {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong'
      }

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue(mockErrorResponse)
      })

      const result = await conversationService.getResponse('Test input')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Internal server error')
      expect(result.message).toBe('Something went wrong')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await conversationService.getResponse('Test input')

      expect(result.success).toBe(false)
      expect(result.error).toBe('SERVICE_UNAVAILABLE')
      expect(result.message).toContain('having trouble processing')
    })

    it('should include CAPTCHA token when provided', async () => {
      const mockResponse = {
        success: true,
        data: mockAIResponse,
        message: 'Success'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      await conversationService.getResponse(
        'Test input',
        [],
        undefined,
        'captcha-token-123'
      )

      const expectedCall = mockFetch.mock.calls[0][1]
      const body = JSON.parse(expectedCall.body)
      
      expect(body.input).toBe('Test input')
      expect(body.captchaToken).toBe('captcha-token-123')
      expect(body.context.conversationStage).toBe('initial')
      expect(body.context.userIntent.ambiguityLevel).toBe('unclear')
    })

    it('should include conversation history', async () => {
      const mockResponse = {
        success: true,
        data: mockAIResponse,
        message: 'Success'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      const conversationHistory = [
        { type: 'user', content: 'Hello' },
        { type: 'assistant', content: 'Hi there!' }
      ]

      await conversationService.getResponse(
        'What can you help me with?',
        conversationHistory
      )

      const expectedCall = mockFetch.mock.calls[0][1]
      const body = JSON.parse(expectedCall.body)
      
      expect(body.input).toBe('What can you help me with?')
      expect(body.conversationHistory).toEqual(conversationHistory)
      expect(body.context.conversationStage).toBe('initial')
      expect(body.captchaToken).toBeUndefined()
    })

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      })

      const result = await conversationService.getResponse('Test input')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Unknown error')
      expect(result.message).toBe('Failed to parse server response')
    })

    it('should create minimal context when none provided', async () => {
      const mockResponse = {
        success: true,
        data: mockAIResponse,
        message: 'Success'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      await conversationService.getResponse('Test input')

      expect(mockFetch).toHaveBeenCalledWith('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: 'Test input',
          conversationHistory: [],
          context: {
            userIntent: {
              destinations: [],
              keywords: [],
              ambiguityLevel: 'unclear',
              tripTypeHint: 'unknown'
            },
            extractedInfo: {},
            missingInfo: [],
            conversationStage: 'initial'
          },
          captchaToken: undefined
        })
      })
    })

    it('should return additional response properties', async () => {
      const mockResponse = {
        success: true,
        data: mockAIResponse,
        message: 'Success',
        clarificationNeeded: true,
        clarificationQuestions: [{ id: '1', question: 'Test?' }],
        conversationContext: mockConversationContext,
        rateLimitInfo: { tokensUsed: 100 },
        requiresCaptcha: false
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      const result = await conversationService.getResponse('Test input')

      expect(result.success).toBe(true)
      expect(result.clarificationNeeded).toBe(true)
      expect(result.clarificationQuestions).toEqual([{ id: '1', question: 'Test?' }])
      expect(result.conversationContext).toEqual(mockConversationContext)
      expect(result.rateLimitInfo).toEqual({ tokensUsed: 100 })
      expect(result.requiresCaptcha).toBe(false)
    })
  })
})