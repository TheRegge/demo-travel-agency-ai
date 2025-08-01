// Mock Next.js server module
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((body, init?) => ({
      status: init?.status || 200,
      ...init,
      body,
      json: async () => body
    }))
  }
}))

// Mock apiUsageService
jest.mock('@/services/apiUsageService', () => ({
  apiUsageService: {
    recordAPICall: jest.fn()
  }
}))

// Mock fetch globally
global.fetch = jest.fn()

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

import { GET } from '@/app/api/photos/route'
import { NextRequest } from 'next/server'
import { apiUsageService } from '@/services/apiUsageService'

const mockApiUsageService = apiUsageService as jest.Mocked<typeof apiUsageService>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('/api/photos', () => {
  // Save original env
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset env
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore env
    process.env = originalEnv
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  const createMockRequest = (url: string) => {
    return {
      url
    } as NextRequest
  }

  it('should return error when destination parameter is missing', async () => {
    const request = createMockRequest('http://localhost:3000/api/photos')
    
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Destination parameter is required')
  })

  it('should return empty response when no API key is configured', async () => {
    delete process.env.UNSPLASH_ACCESS_KEY
    
    const request = createMockRequest('http://localhost:3000/api/photos?destination=Paris')
    
    const response = await GET(request)
    const data = await response.json()

    expect(data.imageUrl).toBe('')
    expect(data.altText).toBe('Paris destination')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should successfully fetch photo from Unsplash', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-api-key'
    
    const mockUnsplashResponse = {
      results: [{
        id: 'photo-1',
        urls: {
          raw: 'https://images.unsplash.com/photo-raw',
          full: 'https://images.unsplash.com/photo-full',
          regular: 'https://images.unsplash.com/photo-regular',
          small: 'https://images.unsplash.com/photo-small',
          thumb: 'https://images.unsplash.com/photo-thumb'
        },
        alt_description: 'Beautiful Paris Eiffel Tower',
        description: null,
        user: {
          name: 'John Doe',
          username: 'johndoe'
        }
      }],
      total: 100,
      total_pages: 10
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUnsplashResponse
    } as Response)

    const request = createMockRequest('http://localhost:3000/api/photos?destination=Paris')
    
    const response = await GET(request)
    const data = await response.json()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.unsplash.com/search/photos'),
      expect.objectContaining({
        headers: {
          'Authorization': 'Client-ID test-api-key'
        }
      })
    )

    expect(data.imageUrl).toBe('https://images.unsplash.com/photo-regular')
    expect(data.altText).toBe('Beautiful Paris Eiffel Tower')
    expect(data.attribution).toEqual({
      photographer: 'John Doe',
      username: 'johndoe'
    })

    expect(mockApiUsageService.recordAPICall).toHaveBeenCalledWith(
      'unsplash',
      expect.any(Number),
      false
    )
  })

  it('should handle empty results from Unsplash', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-api-key'
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ results: [], total: 0, total_pages: 0 })
    } as Response)

    const request = createMockRequest('http://localhost:3000/api/photos?destination=Antarctica')
    
    const response = await GET(request)
    const data = await response.json()

    expect(data.imageUrl).toBe('')
    expect(data.altText).toBe('Antarctica destination')
    expect(data.attribution).toBeUndefined()
  })

  it('should handle Unsplash API errors', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-api-key'
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden'
    } as Response)

    const request = createMockRequest('http://localhost:3000/api/photos?destination=Paris')
    
    const response = await GET(request)
    const data = await response.json()

    expect(data.imageUrl).toBe('')
    expect(data.altText).toBe('Paris destination')
    
    expect(mockApiUsageService.recordAPICall).toHaveBeenCalledWith(
      'unsplash',
      expect.any(Number),
      true
    )
  })

  it('should handle network errors', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-api-key'
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const request = createMockRequest('http://localhost:3000/api/photos?destination=Paris')
    
    const response = await GET(request)
    const data = await response.json()

    expect(data.imageUrl).toBe('')
    expect(data.altText).toBe('Paris destination')
  })

  it('should use description as fallback for alt text', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-api-key'
    
    const mockUnsplashResponse = {
      results: [{
        id: 'photo-1',
        urls: {
          raw: 'https://images.unsplash.com/photo-raw',
          full: 'https://images.unsplash.com/photo-full',
          regular: 'https://images.unsplash.com/photo-regular',
          small: 'https://images.unsplash.com/photo-small',
          thumb: 'https://images.unsplash.com/photo-thumb'
        },
        alt_description: null,
        description: 'Paris cityscape',
        user: {
          name: 'Jane Smith',
          username: 'janesmith'
        }
      }],
      total: 50,
      total_pages: 5
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUnsplashResponse
    } as Response)

    const request = createMockRequest('http://localhost:3000/api/photos?destination=Paris')
    
    const response = await GET(request)
    const data = await response.json()

    expect(data.altText).toBe('Paris cityscape')
  })

  it('should use destination as fallback when no alt text or description', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-api-key'
    
    const mockUnsplashResponse = {
      results: [{
        id: 'photo-1',
        urls: {
          raw: 'https://images.unsplash.com/photo-raw',
          full: 'https://images.unsplash.com/photo-full',
          regular: 'https://images.unsplash.com/photo-regular',
          small: 'https://images.unsplash.com/photo-small',
          thumb: 'https://images.unsplash.com/photo-thumb'
        },
        alt_description: null,
        description: null,
        user: {
          name: 'Bob Johnson',
          username: 'bobjohnson'
        }
      }],
      total: 25,
      total_pages: 3
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUnsplashResponse
    } as Response)

    const request = createMockRequest('http://localhost:3000/api/photos?destination=Tokyo')
    
    const response = await GET(request)
    const data = await response.json()

    expect(data.altText).toBe('Tokyo destination')
  })
})