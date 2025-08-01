import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock crypto.randomUUID
global.crypto = {
  randomUUID: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock fetch for API calls
global.fetch = jest.fn()

// Suppress console.warn for certain expected warnings during tests
const originalWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.('Error loading persistent context')) {
    return
  }
  originalWarn(...args)
}