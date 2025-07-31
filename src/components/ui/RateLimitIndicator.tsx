/**
 * Rate Limit Indicator Component
 * Shows usage status and warnings to users
 */

import React from 'react'
import { AlertTriangle, Clock, Zap, MessageCircle } from 'lucide-react'
import { useRateLimit } from '@/hooks/useRateLimit'

interface RateLimitIndicatorProps {
  className?: string
  showDetails?: boolean
}

export function RateLimitIndicator({ 
  className = '', 
  showDetails = false 
}: RateLimitIndicatorProps) {
  const rateLimit = useRateLimit()
  
  // Don't show anything if not approaching limits
  if (!rateLimit.warningThreshold && !rateLimit.isLimited) {
    return null
  }
  
  const getStatusColor = () => {
    if (rateLimit.isLimited) return 'text-red-600 bg-red-50 border-red-200'
    if (rateLimit.warningThreshold) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }
  
  const getIcon = () => {
    if (rateLimit.isLimited) return <AlertTriangle className="w-4 h-4" />
    if (rateLimit.warningThreshold) return <Clock className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }
  
  const getMessage = () => {
    return rateLimit.getRateLimitMessage()
  }
  
  const formatResetTime = (resetTime?: Date) => {
    if (!resetTime) return ''
    
    const now = new Date()
    const diff = resetTime.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `Resets in ${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `Resets in ${minutes}m`
    } else {
      return 'Resets soon'
    }
  }
  
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${getStatusColor()} ${className}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">
            {getMessage()}
          </p>
          
          {showDetails && !rateLimit.isLimited && (
            <div className="mt-2 space-y-1 text-xs opacity-80">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  Sessions
                </span>
                <span>
                  {rateLimit.sessionsUsed}/{rateLimit.config.maxDailySessions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  This conversation
                </span>
                <span>
                  {rateLimit.tokensUsed}/{rateLimit.config.maxSessionTokens} tokens
                </span>
              </div>
            </div>
          )}
          
          {rateLimit.resetTime && (
            <p className="mt-1 text-xs opacity-70">
              {formatResetTime(rateLimit.resetTime)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}