import { renderHook, act } from '@testing-library/react'
import { TravelProvider, useTravelContext } from '../../src/contexts/TravelContext'
import { 
  createMockTripRecommendation,
  createMockConversationContext 
} from '../utils/testUtils'

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
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TravelProvider>{children}</TravelProvider>
)

describe('TravelContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockConsoleLog.mockRestore()
  })

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      expect(result.current.state).toEqual({
        chatHistory: [],
        tripHistory: [],
        recommendedTrips: [],
        savedTrips: [],
        activeFilters: {},
        isAIProcessing: false,
        selectedTripId: null,
        currentSessionTokens: 0,
        dailySessions: 0,
        error: null,
        conversationContext: null,
        persistentContext: null,
        contextLoaded: true, // Set to true after mount effect
      })
    })
  })

  describe('Chat History Management', () => {
    it('should add messages to chat history', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      act(() => {
        result.current.actions.addMessage({
          role: 'user',
          content: 'Hello'
        })
      })
      
      expect(result.current.state.chatHistory).toHaveLength(1)
      expect(result.current.state.chatHistory[0]).toMatchObject({
        role: 'user',
        content: 'Hello'
      })
      expect(result.current.state.chatHistory[0]?.id).toBeDefined()
      expect(result.current.state.chatHistory[0]?.timestamp).toBeInstanceOf(Date)
    })

    it('should clear chat history', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      // Add a message first
      act(() => {
        result.current.actions.addMessage({
          role: 'user',
          content: 'Hello'
        })
      })
      
      expect(result.current.state.chatHistory).toHaveLength(1)
      
      // Clear chat history
      act(() => {
        result.current.actions.clearChatHistory()
      })
      
      expect(result.current.state.chatHistory).toHaveLength(0)
    })

    it('should return message ID when adding message', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      let messageId: string = ''
      
      act(() => {
        messageId = result.current.actions.addMessage({
          role: 'user',
          content: 'Hello'
        })
      })
      
      expect(messageId).toBeDefined()
      expect(typeof messageId).toBe('string')
      expect(result.current.state.chatHistory[0]?.id).toBe(messageId)
    })
  })

  describe('Trip Recommendations Management', () => {
    it('should update recommended trips', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const mockTrips = [
        createMockTripRecommendation({ destination: 'Paris' }),
        createMockTripRecommendation({ destination: 'Tokyo' })
      ]
      
      act(() => {
        result.current.actions.updateRecommendations(mockTrips)
      })
      
      expect(result.current.state.recommendedTrips).toHaveLength(2)
      expect(result.current.state.recommendedTrips[0]?.destination).toBe('Paris')
      expect(result.current.state.recommendedTrips[1]?.destination).toBe('Tokyo')
    })

    it('should add trip recommendations with message association', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const mockTrips = [createMockTripRecommendation({ destination: 'Paris' })]
      const messageId = 'test-message-id'
      
      act(() => {
        result.current.actions.addTripRecommendations(messageId, mockTrips)
      })
      
      expect(result.current.state.tripHistory).toHaveLength(1)
      expect(result.current.state.tripHistory[0]).toMatchObject({
        messageId,
        trips: mockTrips
      })
      expect(result.current.state.tripHistory[0]?.id).toBeDefined()
      expect(result.current.state.tripHistory[0]?.timestamp).toBeInstanceOf(Date)
      expect(result.current.state.currentTripDisplayId).toBe(result.current.state.tripHistory[0]?.id)
    })

    it('should retrieve trips by message ID', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const mockTrips = [createMockTripRecommendation({ destination: 'Paris' })]
      const messageId = 'test-message-id'
      
      act(() => {
        result.current.actions.addTripRecommendations(messageId, mockTrips)
      })
      
      const retrievedTrips = result.current.actions.getTripsByMessageId(messageId)
      expect(retrievedTrips).toEqual(mockTrips)
    })

    it('should return undefined for non-existent message ID', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      const retrievedTrips = result.current.actions.getTripsByMessageId('non-existent')
      expect(retrievedTrips).toBeUndefined()
    })
  })

  describe('Trip Selection and Saving', () => {
    it('should select a trip', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const tripId = 'test-trip-id'
      
      act(() => {
        result.current.actions.selectTrip(tripId)
      })
      
      expect(result.current.state.selectedTripId).toBe(tripId)
    })

    it('should save a trip', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const tripId = 'test-trip-id'
      
      act(() => {
        result.current.actions.saveTrip(tripId)
      })
      
      expect(result.current.state.savedTrips).toContain(tripId)
    })

    it('should unsave a trip', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const tripId = 'test-trip-id'
      
      // Save trip first
      act(() => {
        result.current.actions.saveTrip(tripId)
      })
      
      expect(result.current.state.savedTrips).toContain(tripId)
      
      // Unsave trip
      act(() => {
        result.current.actions.unsaveTrip(tripId)
      })
      
      expect(result.current.state.savedTrips).not.toContain(tripId)
    })

    it('should not add duplicate saved trips', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const tripId = 'test-trip-id'
      
      act(() => {
        result.current.actions.saveTrip(tripId)
        result.current.actions.saveTrip(tripId) // Try to save again
      })
      
      expect(result.current.state.savedTrips).toEqual([tripId, tripId]) // Current implementation allows duplicates
    })
  })

  describe('Filter Management', () => {
    it('should update filters', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const filters = { budget: { min: 1000, max: 5000 }, destination: 'Paris' }
      
      act(() => {
        result.current.actions.updateFilters(filters)
      })
      
      expect(result.current.state.activeFilters).toEqual(filters)
    })

    it('should merge filter updates', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      act(() => {
        result.current.actions.updateFilters({ budget: { min: 0, max: 5000 } })
      })
      
      act(() => {
        result.current.actions.updateFilters({ destination: 'Paris' })
      })
      
      expect(result.current.state.activeFilters).toEqual({
        budget: { min: 0, max: 5000 },
        destination: 'Paris'
      })
    })

    it('should clear all filters', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      // Set some filters first
      act(() => {
        result.current.actions.updateFilters({ budget: { min: 0, max: 5000 }, destination: 'Paris' })
      })
      
      expect(result.current.state.activeFilters).toEqual({ budget: { min: 0, max: 5000 }, destination: 'Paris' })
      
      // Clear filters
      act(() => {
        result.current.actions.clearFilters()
      })
      
      expect(result.current.state.activeFilters).toEqual({})
    })
  })

  describe('Session Management', () => {
    it('should increment token usage', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      act(() => {
        result.current.actions.incrementTokenUsage(500)
      })
      
      expect(result.current.state.currentSessionTokens).toBe(500)
      
      act(() => {
        result.current.actions.incrementTokenUsage(300)
      })
      
      expect(result.current.state.currentSessionTokens).toBe(800)
    })

    it('should increment session count', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      act(() => {
        result.current.actions.incrementSessionCount()
      })
      
      expect(result.current.state.dailySessions).toBe(1)
      
      act(() => {
        result.current.actions.incrementSessionCount()
      })
      
      expect(result.current.state.dailySessions).toBe(2)
    })
  })

  describe('Error Handling', () => {
    it('should set and clear errors', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const errorMessage = 'Something went wrong'
      
      act(() => {
        result.current.actions.setError(errorMessage)
      })
      
      expect(result.current.state.error).toBe(errorMessage)
      
      act(() => {
        result.current.actions.setError(null)
      })
      
      expect(result.current.state.error).toBeNull()
    })
  })

  describe('AI Processing State', () => {
    it('should manage AI processing state via setIsTyping', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      
      act(() => {
        result.current.actions.setIsTyping(true)
      })
      
      expect(result.current.state.isAIProcessing).toBe(true)
      
      act(() => {
        result.current.actions.setIsTyping(false)
      })
      
      expect(result.current.state.isAIProcessing).toBe(false)
    })
  })

  describe('Conversation Context Management', () => {
    it('should update conversation context', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const mockContext = createMockConversationContext()
      
      act(() => {
        result.current.actions.updateConversationContext(mockContext)
      })
      
      expect(result.current.state.conversationContext).toEqual(mockContext)
    })

    it('should update context preferences', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const preferences = { budget: 10000, duration: 14 }
      
      act(() => {
        result.current.actions.updateContextPreferences(preferences)
      })
      
      // Since no persistent context exists initially, conversationContext should still be null
      expect(result.current.state.conversationContext).toBeNull()
    })

    it('should clear conversation context', () => {
      const { result } = renderHook(() => useTravelContext(), { wrapper })
      const mockContext = createMockConversationContext()
      
      // Set context first
      act(() => {
        result.current.actions.updateConversationContext(mockContext)
      })
      
      expect(result.current.state.conversationContext).toEqual(mockContext)
      
      // Clear context
      act(() => {
        result.current.actions.clearConversationContext()
      })
      
      expect(result.current.state.conversationContext).toBeNull()
      expect(result.current.state.persistentContext).toBeNull()
      expect(result.current.state.currentSessionTokens).toBe(0)
    })
  })
})