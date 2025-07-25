/**
 * Conversation Input Component  
 * Handles user input with character limits and validation
 */

import { useState, FormEvent } from 'react'
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
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-12 py-10 text-2xl md:text-3xl rounded-2xl border-2 border-gray-300 focus:border-sky-500 focus:outline-none shadow-xl bg-white placeholder:text-gray-400 transition-all duration-200 hover:border-gray-400 resize-none min-h-[150px] md:min-h-[180px] disabled:opacity-60 disabled:cursor-not-allowed"
          autoFocus
        />
        <div className={`absolute bottom-4 right-4 text-sm font-medium ${getColorClass()}`}>
          {count}/{maxChars}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!value.trim() || !isValid || disabled}
        className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 disabled:bg-sky-100 disabled:cursor-not-allowed text-white disabled:text-white font-bold text-xl md:text-2xl py-6 px-12 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
      >
        Create My Dream Adventure
      </button>
    </form>
  )
}