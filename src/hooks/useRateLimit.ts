/**
 * useRateLimit Hook
 * Provides client-side rate limit tracking and UI state management
 * Syncs with server-side rate limiting for consistent UX
 */

import { useState, useEffect, useCallback } from 'react'
import { useTravelContext } from '@/contexts/TravelContext'

export interface RateLimitState {
  sessionsUsed: number
  sessionsRemaining: number
  tokensUsed: number
  tokensRemaining: number
  isLimited: boolean
  limitReason?: 'session_limit' | 'token_limit' | 'cost_limit' | undefined
  resetTime?: Date
  canStartNewSession: boolean
  warningThreshold: boolean // True when approaching limits
}

interface RateLimitConfig {
  maxDailySessions: number
  maxSessionTokens: number
  warningThresholdPercent: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxDailySessions: 5,
  maxSessionTokens: 2500,
  warningThresholdPercent: 0.8, // Warn at 80% usage
}

export function useRateLimit(config: Partial<RateLimitConfig> = {}) {
  const { state } = useTravelContext()
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Local storage keys for persisting rate limit data
  const STORAGE_KEY = 'travel_ai_rate_limit'
  const SESSION_KEY = 'travel_ai_current_session'
  
  // Initialize state from local storage
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>(() => {
    if (typeof window === 'undefined') {
      return {
        sessionsUsed: 0,
        sessionsRemaining: finalConfig.maxDailySessions,
        tokensUsed: 0,
        tokensRemaining: finalConfig.maxSessionTokens,
        isLimited: false,
        canStartNewSession: true,
        warningThreshold: false,
      }
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        const today = new Date().toISOString().split('T')[0]
        
        // Reset if it's a new day
        if (data.date !== today) {
          return {
            sessionsUsed: 0,
            sessionsRemaining: finalConfig.maxDailySessions,
            tokensUsed: 0,
            tokensRemaining: finalConfig.maxSessionTokens,
            isLimited: false,
            canStartNewSession: true,
            warningThreshold: false,
          }
        }
        
        // Restore state
        const sessionsRemaining = Math.max(0, finalConfig.maxDailySessions - data.sessionsUsed)
        const tokensRemaining = Math.max(0, finalConfig.maxSessionTokens - data.tokensUsed)
        
        return {
          sessionsUsed: data.sessionsUsed || 0,
          sessionsRemaining,
          tokensUsed: data.tokensUsed || 0,
          tokensRemaining,
          isLimited: sessionsRemaining === 0 || tokensRemaining === 0,
          canStartNewSession: sessionsRemaining > 0,
          warningThreshold: 
            data.sessionsUsed / finalConfig.maxDailySessions >= finalConfig.warningThresholdPercent ||
            data.tokensUsed / finalConfig.maxSessionTokens >= finalConfig.warningThresholdPercent,
        }
      }
    } catch (error) {
      console.error('Failed to load rate limit state:', error)
    }
    
    return {
      sessionsUsed: 0,
      sessionsRemaining: finalConfig.maxDailySessions,
      tokensUsed: 0,
      tokensRemaining: finalConfig.maxSessionTokens,
      isLimited: false,
      canStartNewSession: true,
      warningThreshold: false,
    }
  })
  
  // Persist state to local storage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const today = new Date().toISOString().split('T')[0]
    const dataToStore = {
      date: today,
      sessionsUsed: rateLimitState.sessionsUsed,
      tokensUsed: rateLimitState.tokensUsed,
      lastUpdated: new Date().toISOString(),
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    } catch (error) {
      console.error('Failed to save rate limit state:', error)
    }
  }, [rateLimitState.sessionsUsed, rateLimitState.tokensUsed])
  
  // Sync with context token usage
  useEffect(() => {
    const currentTokens = state.currentSessionTokens
    if (currentTokens > rateLimitState.tokensUsed) {
      const tokensRemaining = Math.max(0, finalConfig.maxSessionTokens - currentTokens)
      const warningThreshold = currentTokens / finalConfig.maxSessionTokens >= finalConfig.warningThresholdPercent
      
      setRateLimitState(prev => ({
        ...prev,
        tokensUsed: currentTokens,
        tokensRemaining,
        isLimited: prev.sessionsRemaining === 0 || tokensRemaining === 0,
        warningThreshold: warningThreshold || prev.sessionsUsed / finalConfig.maxDailySessions >= finalConfig.warningThresholdPercent,
      }))
    }
  }, [state.currentSessionTokens, finalConfig.maxSessionTokens, finalConfig.maxDailySessions, finalConfig.warningThresholdPercent, rateLimitState.tokensUsed])
  
  /**
   * Starts a new session if allowed
   */
  const startNewSession = useCallback(() => {
    if (!rateLimitState.canStartNewSession) {
      return false
    }
    
    const newSessionsUsed = rateLimitState.sessionsUsed + 1
    const sessionsRemaining = Math.max(0, finalConfig.maxDailySessions - newSessionsUsed)
    
    setRateLimitState(prev => ({
      ...prev,
      sessionsUsed: newSessionsUsed,
      sessionsRemaining,
      tokensUsed: 0,
      tokensRemaining: finalConfig.maxSessionTokens,
      canStartNewSession: sessionsRemaining > 0,
      isLimited: sessionsRemaining === 0,
      warningThreshold: newSessionsUsed / finalConfig.maxDailySessions >= finalConfig.warningThresholdPercent,
    }))
    
    // Store session start time
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        startedAt: new Date().toISOString(),
        sessionNumber: newSessionsUsed,
      }))
    }
    
    return true
  }, [rateLimitState, finalConfig])
  
  /**
   * Updates rate limit state from server response
   */
  const updateFromServerResponse = useCallback((serverData: {
    sessionsUsed: number
    sessionsRemaining: number
    tokensUsed: number
    tokensRemaining: number
    reason?: 'session_limit' | 'token_limit' | 'cost_limit'
    resetTime?: string
  }) => {
    setRateLimitState({
      sessionsUsed: serverData.sessionsUsed,
      sessionsRemaining: serverData.sessionsRemaining,
      tokensUsed: serverData.tokensUsed,
      tokensRemaining: serverData.tokensRemaining,
      isLimited: serverData.sessionsRemaining === 0 || serverData.tokensRemaining === 0,
      ...(serverData.reason && { limitReason: serverData.reason }),
      ...(serverData.resetTime && { resetTime: new Date(serverData.resetTime) }),
      canStartNewSession: serverData.sessionsRemaining > 0,
      warningThreshold: 
        serverData.sessionsUsed / finalConfig.maxDailySessions >= finalConfig.warningThresholdPercent ||
        serverData.tokensUsed / finalConfig.maxSessionTokens >= finalConfig.warningThresholdPercent,
    })
  }, [finalConfig])
  
  /**
   * Gets a user-friendly message about the current rate limit status
   */
  const getRateLimitMessage = useCallback((): string | null => {
    if (rateLimitState.isLimited) {
      switch (rateLimitState.limitReason) {
        case 'session_limit':
          return `You've reached your daily limit of ${finalConfig.maxDailySessions} conversations. Please come back tomorrow!`
        case 'token_limit':
          return 'This conversation has reached its length limit. Please start a new conversation to continue.'
        case 'cost_limit':
          return 'Daily usage limit reached. Please try again tomorrow.'
        default:
          return 'Rate limit exceeded. Please try again later.'
      }
    }
    
    if (rateLimitState.warningThreshold) {
      if (rateLimitState.sessionsRemaining <= 1) {
        return `You have ${rateLimitState.sessionsRemaining} conversation${rateLimitState.sessionsRemaining === 1 ? '' : 's'} remaining today.`
      }
      if (rateLimitState.tokensRemaining < 500) {
        return 'This conversation is approaching its length limit.'
      }
    }
    
    return null
  }, [rateLimitState, finalConfig.maxDailySessions])
  
  /**
   * Resets rate limits (for testing/development)
   */
  const resetLimits = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(SESSION_KEY)
    }
    
    setRateLimitState({
      sessionsUsed: 0,
      sessionsRemaining: finalConfig.maxDailySessions,
      tokensUsed: 0,
      tokensRemaining: finalConfig.maxSessionTokens,
      isLimited: false,
      canStartNewSession: true,
      warningThreshold: false,
    })
  }, [finalConfig])
  
  return {
    ...rateLimitState,
    startNewSession,
    updateFromServerResponse,
    getRateLimitMessage,
    resetLimits,
    config: finalConfig,
  }
}