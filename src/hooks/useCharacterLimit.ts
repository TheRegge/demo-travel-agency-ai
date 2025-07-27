/**
 * Custom hook for character limit functionality
 * Provides character counting and validation logic
 */

import { useMemo } from 'react'
import { UseCharacterLimitReturn } from '@/types/conversation'

export const useCharacterLimit = (
  value: string, 
  maxChars: number = 750
): UseCharacterLimitReturn => {
  
  const count = value.length
  const isValid = count <= maxChars
  
  /**
   * Get color class based on remaining characters
   */
  const getColorClass = useMemo(() => {
    return (): string => {
      const remaining = maxChars - count
      
      if (remaining <= 50) return 'text-red-500'
      if (remaining <= 150) return 'text-amber-500'
      return 'text-gray-600'
    }
  }, [count, maxChars])

  return {
    count,
    isValid,
    getColorClass,
    maxChars
  }
}