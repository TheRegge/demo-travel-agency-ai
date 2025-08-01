import { renderHook, act } from '@testing-library/react'
import { useConversation } from '../../src/hooks/useConversation'
import { TravelProvider } from '../../src/contexts/TravelContext'

// Mock the services and hooks
jest.mock('../../src/services/conversationService', () => ({
  conversationService: {
    getResponse: jest.fn(),
  }
}))

jest.mock('../../src/hooks/useRateLimit', () => ({
  useRateLimit: jest.fn(() => ({
    checkLimit: jest.fn(),
    recordUsage: jest.fn(),
    isLimited: false,
    status: {
      allowed: true,
      sessionsUsed: 0,
      sessionsRemaining: 5,
      tokensUsed: 0,
      tokensRemaining: 2500,
      estimatedCost: 0,
      resetTime: new Date(),
    },
    updateFromServerResponse: jest.fn()
  }))
}))

// Mock contextStorageService
jest.mock('../../src/services/contextStorageService', () => ({
  contextStorage: {
    loadContext: jest.fn(() => null),
    saveContext: jest.fn(),
    updateContextPreferences: jest.fn(),
    clearContext: jest.fn(),
    getContextSummary: jest.fn(() => null),
    isContextPersistenceEnabled: jest.fn(() => true),
    toConversationContext: jest.fn((context) => context)
  }
}))

// Mock console methods to reduce test noise
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TravelProvider>{children}</TravelProvider>
)

describe('useConversation', () => {
  const mockConversationService = require('../../src/services/conversationService').conversationService

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
    mockConsoleLog.mockRestore()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useConversation(), { wrapper })

    expect(result.current.state.isLoading).toBe(false)
    expect(result.current.state.error).toBeNull()
    expect(result.current.state.messages).toEqual([])
    expect(result.current.state.userInput).toBe('')
    expect(result.current.state.waitingForClarification).toBe(false)
    expect(result.current.state.requiresCaptcha).toBe(false)
  })

  it('should provide required methods', () => {
    const { result } = renderHook(() => useConversation(), { wrapper })

    expect(typeof result.current.submitMessage).toBe('function')
    expect(typeof result.current.updateInput).toBe('function')
    expect(typeof result.current.clearConversation).toBe('function')
    expect(typeof result.current.answerClarification).toBe('function')
    expect(typeof result.current.submitClarificationAnswers).toBe('function')
  })

  it('should update user input', () => {
    const { result } = renderHook(() => useConversation(), { wrapper })

    act(() => {
      result.current.updateInput('Test input')
    })

    expect(result.current.state.userInput).toBe('Test input')
  })

  it('should clear conversation', () => {
    const { result } = renderHook(() => useConversation(), { wrapper })

    // First add some state
    act(() => {
      result.current.updateInput('Test input')
    })

    expect(result.current.state.userInput).toBe('Test input')

    // Then clear
    act(() => {
      result.current.clearConversation()
    })

    expect(result.current.state.userInput).toBe('')
    expect(result.current.state.messages).toEqual([])
    expect(result.current.state.error).toBeNull()
  })

  it('should handle successful message submission', async () => {
    const mockResponse = {
      success: true,
      message: 'AI response',
      data: {
        chatMessage: 'Here are some trips for you!',
        recommendations: [{
          tripId: 'test-trip',
          destination: 'Paris',
          duration: 7,
          estimatedCost: 2500,
          highlights: ['Eiffel Tower'],
          description: 'Test trip',
          activities: ['Sightseeing'],
          season: 'spring',
          kidFriendly: true,
          customizations: {},
          score: 85,
          type: 'single' as const
        }]
      }
    }

    mockConversationService.getResponse.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useConversation(), { wrapper })

    await act(async () => {
      await result.current.submitMessage('Test message')
    })

    expect(mockConversationService.getResponse).toHaveBeenCalledWith(
      'Test message',
      [],
      undefined,
      undefined
    )
    expect(result.current.state.isLoading).toBe(false)
    expect(result.current.state.messages).toHaveLength(2) // User + AI message
  })

  it('should not submit empty messages', async () => {
    const { result } = renderHook(() => useConversation(), { wrapper })

    await act(async () => {
      await result.current.submitMessage('   ') // Only whitespace
    })

    expect(mockConversationService.getResponse).not.toHaveBeenCalled()
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle service errors', async () => {
    const mockError = {
      success: false,
      error: 'SERVICE_ERROR',
      message: 'Something went wrong'
    }

    mockConversationService.getResponse.mockResolvedValue(mockError)

    const { result } = renderHook(() => useConversation(), { wrapper })

    await act(async () => {
      await result.current.submitMessage('Test message')
    })

    expect(result.current.state.error).toBe('Something went wrong')
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle CAPTCHA requirement', async () => {
    const mockResponse = {
      success: false,
      requiresCaptcha: true,
      message: 'CAPTCHA required'
    }

    mockConversationService.getResponse.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useConversation(), { wrapper })

    await act(async () => {
      await result.current.submitMessage('Test message')
    })

    expect(result.current.state.requiresCaptcha).toBe(true)
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle clarification answers', () => {
    const { result } = renderHook(() => useConversation(), { wrapper })

    // First set up a conversation context
    act(() => {
      result.current.state.conversationContext = {
        userIntent: {
          destinations: ['Paris'],
          keywords: ['budget'],
          ambiguityLevel: 'clear',
          tripTypeHint: 'single'
        },
        extractedInfo: {},
        missingInfo: ['duration', 'budget'],
        conversationStage: 'clarifying'
      }
    })

    // Answer a clarification question
    act(() => {
      result.current.answerClarification('duration-001', '7')
    })

    // The context should be updated
    expect(result.current.state.conversationContext?.extractedInfo.duration).toBe(7)
  })

  it('should handle network errors', async () => {
    mockConversationService.getResponse.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useConversation(), { wrapper })

    await act(async () => {
      await result.current.submitMessage('Test message')
    })

    expect(result.current.state.error).toContain('Unable to process')
    expect(result.current.state.isLoading).toBe(false)
  })
})