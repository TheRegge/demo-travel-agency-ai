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
    getAllStats: jest.fn(),
    getTotalCostToday: jest.fn(),
    getQuotaWarnings: jest.fn()
  }
}))

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

import { GET } from '@/app/api/usage-stats/route'
import { apiUsageService } from '@/services/apiUsageService'

const mockApiUsageService = apiUsageService as jest.Mocked<typeof apiUsageService>

describe('/api/usage-stats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock current date for consistent testing
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  it('should return usage statistics successfully', async () => {
    const mockStats = {
      gemini: {
        calls: 150,
        errors: 2,
        averageResponseTime: 1234,
        totalTokens: 50000,
        estimatedCost: 0.10
      },
      unsplash: {
        calls: 25,
        errors: 0,
        averageResponseTime: 456,
        totalTokens: 0,
        estimatedCost: 0
      }
    }

    const mockTotalCost = 0.15
    const mockQuotaWarnings = ['Daily API limit approaching (80% used)']

    mockApiUsageService.getAllStats.mockReturnValue(mockStats)
    mockApiUsageService.getTotalCostToday.mockReturnValue(mockTotalCost)
    mockApiUsageService.getQuotaWarnings.mockReturnValue(mockQuotaWarnings)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      stats: mockStats,
      totalCost: mockTotalCost,
      quotaWarnings: mockQuotaWarnings,
      timestamp: '2024-01-15T12:00:00.000Z'
    })

    expect(mockApiUsageService.getAllStats).toHaveBeenCalledTimes(1)
    expect(mockApiUsageService.getTotalCostToday).toHaveBeenCalledTimes(1)
    expect(mockApiUsageService.getQuotaWarnings).toHaveBeenCalledTimes(1)
  })

  it('should handle empty statistics', async () => {
    mockApiUsageService.getAllStats.mockReturnValue({})
    mockApiUsageService.getTotalCostToday.mockReturnValue(0)
    mockApiUsageService.getQuotaWarnings.mockReturnValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      stats: {},
      totalCost: 0,
      quotaWarnings: [],
      timestamp: '2024-01-15T12:00:00.000Z'
    })
  })

  it('should handle service errors gracefully', async () => {
    mockApiUsageService.getAllStats.mockImplementation(() => {
      throw new Error('Database connection failed')
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      error: 'Failed to fetch usage stats'
    })
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error fetching usage stats:',
      expect.any(Error)
    )
  })

  it('should handle partial service failures', async () => {
    mockApiUsageService.getAllStats.mockReturnValue({
      gemini: {
        calls: 100,
        errors: 5,
        averageResponseTime: 1000,
        totalTokens: 40000,
        estimatedCost: 0.08
      }
    })
    mockApiUsageService.getTotalCostToday.mockImplementation(() => {
      throw new Error('Cost calculation error')
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      error: 'Failed to fetch usage stats'
    })
  })

  it('should include multiple quota warnings when present', async () => {
    const mockStats = {
      gemini: {
        calls: 450,
        errors: 10,
        averageResponseTime: 1500,
        totalTokens: 120000,
        estimatedCost: 0.24
      }
    }

    const mockQuotaWarnings = [
      'Daily API limit approaching (90% used)',
      'Error rate threshold exceeded (2.2%)',
      'Token usage high for current session'
    ]

    mockApiUsageService.getAllStats.mockReturnValue(mockStats)
    mockApiUsageService.getTotalCostToday.mockReturnValue(0.24)
    mockApiUsageService.getQuotaWarnings.mockReturnValue(mockQuotaWarnings)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.quotaWarnings).toHaveLength(3)
    expect(data.quotaWarnings).toEqual(mockQuotaWarnings)
  })
})