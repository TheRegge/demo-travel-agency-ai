/**
 * Loading Spinner Component
 * Reusable loading indicator for AI processing states
 * Now supports rotating funny messages for better user engagement
 */

import { LoadingSpinnerProps } from '@/types/conversation'
import { useRotatingMessages } from '@/hooks/useRotatingMessages'

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12', 
  lg: 'h-16 w-16'
}

export const LoadingSpinner = ({ 
  size = 'md',
  className = '',
  message,
  useRotatingMessages: shouldUseRotatingMessages = false
}: LoadingSpinnerProps) => {
  const { currentMessage, isVisible } = useRotatingMessages()
  
  // Determine which message to display
  const displayMessage = shouldUseRotatingMessages 
    ? currentMessage 
    : message || 'Creating your perfect trip...'

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-sky-500 ${sizeClasses[size]} mb-4`} />
      <p 
        className={`text-xl text-gray-600 text-center max-w-2xl px-4 transition-opacity duration-300 ${
          shouldUseRotatingMessages ? (isVisible ? 'opacity-100' : 'opacity-50') : 'opacity-100'
        }`}
      >
        {displayMessage}
      </p>
    </div>
  )
}