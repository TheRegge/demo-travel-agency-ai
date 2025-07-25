/**
 * Loading Spinner Component
 * Reusable loading indicator for AI processing states
 */

import { LoadingSpinnerProps } from '@/types/conversation'

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12', 
  lg: 'h-16 w-16'
}

export const LoadingSpinner = ({ 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-sky-500 ${sizeClasses[size]} mb-4`} />
      <p className="text-xl text-gray-600">Creating your perfect trip...</p>
    </div>
  )
}