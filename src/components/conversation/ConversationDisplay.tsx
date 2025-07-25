/**
 * Conversation Display Component
 * Handles display of AI responses and loading states
 */

import { ConversationDisplayProps } from '@/types/conversation'
import { LoadingSpinner } from './LoadingSpinner'

export const ConversationDisplay = ({
  isLoading,
  response,
  onLoadingComplete
}: ConversationDisplayProps) => {
  
  // Show initial state when no response and not loading
  if (!response && !isLoading) {
    return (
      <>
        <h1 className="mb-8 text-5xl font-bold text-gray-900 md:text-7xl drop-shadow-sm">
          Your AI Travel Planning
          <span className="text-sky-600"> Assistant</span>
        </h1>
        <p className="mb-16 text-xl text-gray-700 md:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
          Tell me about your dream trip
        </p>
      </>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="mb-16 flex flex-col items-center">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  // Show AI response
  if (response) {
    return (
      <div className="mb-16 max-w-4xl mx-auto">
        <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed drop-shadow-sm">
          {response}
        </p>
      </div>
    )
  }

  return null
}