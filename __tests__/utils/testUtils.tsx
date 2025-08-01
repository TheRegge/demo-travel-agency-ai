import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { TravelProvider } from '@/contexts/TravelContext'

// Mock data factories
export const createMockChatMessage = (overrides = {}) => ({
  id: 'test-message-id',
  type: 'user' as const,
  content: 'Test message',
  timestamp: new Date(),
  ...overrides,
})

export const createMockTripRecommendation = (overrides = {}) => ({
  tripId: 'test-trip-id',
  destination: 'Test Destination',
  duration: 7,
  estimatedCost: 2500,
  highlights: ['Test highlight'],
  description: 'Test description',
  activities: ['Test activity'],
  season: 'summer',
  kidFriendly: true,
  customizations: {},
  score: 85,
  type: 'single' as const,
  ...overrides,
})

export const createMockConversationContext = (overrides = {}) => ({
  userIntent: {
    destinations: ['Paris'],
    keywords: ['romantic', 'luxury'],
    ambiguityLevel: 'clear' as const,
    tripTypeHint: 'single' as const,
  },
  extractedInfo: {
    budget: 5000,
    duration: 7,
    travelers: {
      adults: 2,
      children: 0,
    },
    preferences: ['romantic', 'culture'],
  },
  missingInfo: [],
  conversationStage: 'planning' as const,
  ...overrides,
})

// Custom render with providers
interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <TravelProvider>
      {children}
    </TravelProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test utilities
export const mockFetch = (response: any, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(response),
  })
}

export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))