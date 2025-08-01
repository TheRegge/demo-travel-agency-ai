/**
 * API Usage Tracking Service
 * Monitors and tracks usage of all third-party APIs
 * Provides real-time usage statistics and quota management
 */

export interface APIUsageStats {
  callsToday: number
  callsThisHour: number
  lastCallTime?: Date
  errors: number
  avgResponseTime: number
  quotaLimit?: number
  quotaRemaining?: number
  cost?: number
}

export interface APIProvider {
  name: string
  dailyLimit?: number
  hourlyLimit?: number
  monthlyLimit?: number
  costPerCall?: number
  freeCredits?: number
}

// API provider configurations based on documentation
const API_PROVIDERS: Record<string, APIProvider> = {
  openweather: {
    name: 'OpenWeatherMap',
    dailyLimit: 1000,
    costPerCall: 0
  },
  amadeus: {
    name: 'Amadeus',
    monthlyLimit: 10000, // Upper limit for most APIs
    costPerCall: 0
  },
  geoapify: {
    name: 'Geoapify',
    dailyLimit: 3000,
    freeCredits: 3000,
    costPerCall: 0
  },
  unsplash: {
    name: 'Unsplash',
    hourlyLimit: 50,
    costPerCall: 0
  },
  gemini: {
    name: 'Google Gemini',
    costPerCall: 0.000002 // Per token estimate
  }
}

// In-memory storage for API usage (production would use Redis)
interface UsageRecord {
  timestamp: Date
  responseTime: number
  error?: boolean
  tokens?: number
}

class APIUsageService {
  private usage: Map<string, UsageRecord[]> = new Map()
  private listeners: Set<(stats: Record<string, APIUsageStats>) => void> = new Set()
  
  constructor() {
    // Initialize storage for each provider
    Object.keys(API_PROVIDERS).forEach(provider => {
      this.usage.set(provider, [])
    })
    
    // Clean up old records every hour
    setInterval(() => this.cleanupOldRecords(), 60 * 60 * 1000)
  }
  
  /**
   * Records an API call
   */
  recordAPICall(
    provider: string, 
    responseTime: number, 
    error: boolean = false,
    metadata?: { tokens?: number }
  ) {
    const records = this.usage.get(provider) || []
    const record: UsageRecord = {
      timestamp: new Date(),
      responseTime,
      error,
      ...(metadata?.tokens && { tokens: metadata.tokens })
    }
    
    records.push(record)
    this.usage.set(provider, records)
    
    // Notify listeners
    this.notifyListeners()
    
    // Always log to console for debugging
    console.log(`🔥 [API Usage] ${provider}:`, {
      responseTime: `${responseTime}ms`,
      error,
      totalCalls: records.length,
      ...(metadata?.tokens && { tokens: metadata.tokens })
    })
  }
  
  /**
   * Gets usage statistics for a specific provider
   */
  getProviderStats(provider: string): APIUsageStats {
    const records = this.usage.get(provider) || []
    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    const todayRecords = records.filter(r => r.timestamp >= todayStart)
    const hourRecords = records.filter(r => r.timestamp >= hourAgo)
    
    const callsToday = todayRecords.length
    const callsThisHour = hourRecords.length
    const errors = todayRecords.filter(r => r.error).length
    
    const avgResponseTime = todayRecords.length > 0
      ? todayRecords.reduce((sum, r) => sum + r.responseTime, 0) / todayRecords.length
      : 0
    
    const lastCallTime = records.length > 0 
      ? records[records.length - 1]?.timestamp 
      : undefined
    
    // Calculate cost for Gemini
    let cost = 0
    if (provider === 'gemini' && API_PROVIDERS.gemini?.costPerCall) {
      const totalTokens = todayRecords.reduce((sum, r) => sum + (r.tokens || 0), 0)
      cost = totalTokens * (API_PROVIDERS.gemini?.costPerCall || 0)
    }
    
    // Calculate quota
    const providerConfig = API_PROVIDERS[provider]
    let quotaLimit: number | undefined
    let quotaRemaining: number | undefined
    
    if (providerConfig) {
      if (providerConfig.dailyLimit) {
        quotaLimit = providerConfig.dailyLimit
        quotaRemaining = Math.max(0, providerConfig.dailyLimit - callsToday)
      } else if (providerConfig.hourlyLimit) {
        quotaLimit = providerConfig.hourlyLimit
        quotaRemaining = Math.max(0, providerConfig.hourlyLimit - callsThisHour)
      }
    }
    
    return {
      callsToday,
      callsThisHour,
      ...(lastCallTime && { lastCallTime }),
      errors,
      avgResponseTime: Math.round(avgResponseTime),
      ...(quotaLimit !== undefined && { quotaLimit }),
      ...(quotaRemaining !== undefined && { quotaRemaining }),
      ...(cost > 0 && { cost })
    }
  }
  
  /**
   * Gets all provider statistics
   */
  getAllStats(): Record<string, APIUsageStats> {
    const stats: Record<string, APIUsageStats> = {}
    
    Object.keys(API_PROVIDERS).forEach(provider => {
      stats[provider] = this.getProviderStats(provider)
    })
    
    return stats
  }
  
  /**
   * Gets total estimated cost for today
   */
  getTotalCostToday(): number {
    const stats = this.getAllStats()
    return Object.values(stats).reduce((sum, stat) => sum + (stat.cost || 0), 0)
  }
  
  /**
   * Checks if any API is approaching its limit
   */
  getQuotaWarnings(): Array<{ provider: string; message: string; severity: 'warning' | 'critical' }> {
    const warnings: Array<{ provider: string; message: string; severity: 'warning' | 'critical' }> = []
    const stats = this.getAllStats()
    
    Object.entries(stats).forEach(([provider, stat]) => {
      if (stat.quotaLimit && stat.quotaRemaining !== undefined) {
        const usagePercent = (stat.quotaLimit - stat.quotaRemaining) / stat.quotaLimit
        
        if (usagePercent >= 0.9) {
          warnings.push({
            provider,
            message: `${API_PROVIDERS[provider]?.name || provider} has used ${Math.round(usagePercent * 100)}% of quota`,
            severity: 'critical'
          })
        } else if (usagePercent >= 0.75) {
          warnings.push({
            provider,
            message: `${API_PROVIDERS[provider]?.name || provider} approaching limit (${Math.round(usagePercent * 100)}% used)`,
            severity: 'warning'
          })
        }
      }
    })
    
    // Check cost limit
    const totalCost = this.getTotalCostToday()
    if (totalCost >= 4.5) {
      warnings.push({
        provider: 'gemini',
        message: `Daily cost approaching limit: $${totalCost.toFixed(2)} of $5.00`,
        severity: 'critical'
      })
    } else if (totalCost >= 3.75) {
      warnings.push({
        provider: 'gemini',
        message: `Daily cost at $${totalCost.toFixed(2)} of $5.00`,
        severity: 'warning'
      })
    }
    
    return warnings
  }
  
  /**
   * Subscribe to usage updates
   */
  subscribe(callback: (stats: Record<string, APIUsageStats>) => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }
  
  /**
   * Notify all listeners of updates
   */
  private notifyListeners() {
    const stats = this.getAllStats()
    this.listeners.forEach(callback => callback(stats))
  }
  
  /**
   * Clean up records older than 24 hours
   */
  private cleanupOldRecords() {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    this.usage.forEach((records, provider) => {
      const filtered = records.filter(r => r.timestamp > dayAgo)
      this.usage.set(provider, filtered)
    })
  }
  
  /**
   * Reset usage for a specific provider (dev only)
   */
  resetProvider(provider: string) {
    if (process.env.NODE_ENV === 'development') {
      this.usage.set(provider, [])
      this.notifyListeners()
    }
  }
  
  /**
   * Reset all usage (dev only)
   */
  resetAll() {
    if (process.env.NODE_ENV === 'development') {
      Object.keys(API_PROVIDERS).forEach(provider => {
        this.usage.set(provider, [])
      })
      this.notifyListeners()
    }
  }
}

// Export singleton instance
export const apiUsageService = new APIUsageService()

// Export provider information
export { API_PROVIDERS }