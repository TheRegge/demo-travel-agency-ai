/**
 * Conversation Input Component  
 * Handles user input with character limits and validation
 */

import { FormEvent } from 'react'
import { ConversationInputProps } from '@/types/conversation'
import { useCharacterLimit } from '@/hooks/useCharacterLimit'

export const ConversationInput = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength = 750,
  placeholder = "I want to visit beaches in Thailand with my family on a $3000 budget..."
}: ConversationInputProps) => {

  const { count, isValid, getColorClass, maxChars } = useCharacterLimit(value, maxLength)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim() && isValid && !disabled) {
      onSubmit(value.trim())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Character count - positioned at top */}
        <div className={`absolute top-4 right-4 text-xs font-medium ${getColorClass()} z-10`}>
          {count}/{maxChars}
        </div>

        <textarea
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-8 py-6 pr-16 sm:px-10 sm:py-8 sm:pr-20 md:px-12 md:py-10 md:pr-24 text-lg sm:text-xl md:text-2xl lg:text-3xl rounded-2xl border-2 border-gray-300 focus:border-sky-500 focus:outline-none shadow-xl bg-white placeholder:text-gray-400 transition-all duration-200 hover:border-gray-400 resize-none min-h-[120px] sm:min-h-[140px] md:min-h-[150px] lg:min-h-[180px] disabled:opacity-60 disabled:cursor-not-allowed"
          autoFocus
        />

        {/* iPhone-style send button */}
        <button
          type="submit"
          disabled={!value.trim() || !isValid || disabled}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transform -rotate-45 translate-0.25 -translate-y-0.25"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </form>
  )
}