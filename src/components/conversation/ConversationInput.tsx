/**
 * Conversation Input Component  
 * Handles user input with character limits and validation
 */

import { FormEvent, forwardRef, useImperativeHandle, useRef } from 'react'
import { ConversationInputProps } from '@/types/conversation'
import { useCharacterLimit } from '@/hooks/useCharacterLimit'
import { useCaptcha } from '@/hooks/useCaptcha'
import { CaptchaWidget } from '@/components/security/CaptchaWidget'

export interface ConversationInputRef {
  focus: () => void
}

export const ConversationInput = forwardRef<ConversationInputRef, ConversationInputProps>(({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength = 750,
  placeholder = "I want to visit beaches in Thailand with my family on a $3000 budget...",
  requiresCaptcha = false,
  onCaptchaVerify
}, ref) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { count, isValid, getColorClass, maxChars } = useCharacterLimit(value, maxLength)
  const { captchaToken, isVisible, setCaptchaToken, showCaptcha, resetCaptcha } = useCaptcha()

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus()
    }
  }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim() && isValid && !disabled) {
      // If CAPTCHA is required but not completed, show CAPTCHA
      if (requiresCaptcha && !captchaToken) {
        showCaptcha()
        return
      }
      
      // Submit with CAPTCHA token if available
      onSubmit(value.trim(), captchaToken || undefined)
      
      // Reset CAPTCHA after successful submission
      resetCaptcha()
    }
  }

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
    onCaptchaVerify?.(token)
    
    // Auto-submit if form is ready
    if (value.trim() && isValid && !disabled) {
      onSubmit(value.trim(), token)
      resetCaptcha()
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
        <div id="char-count" className={`absolute top-4 right-4 text-xs font-medium ${getColorClass()} z-10`} aria-label={`Character count: ${count} of ${maxChars}`}>
          {count}/{maxChars}
        </div>
        
        {/* Hidden help text for screen readers */}
        <div id="travel-help" className="sr-only">
          Use this text area to describe your dream trip, including destinations, budget, travel dates, and any special requirements. The AI will help create personalized travel recommendations.
        </div>

        <label htmlFor="travel-input" className="sr-only">
          Describe your dream trip or ask questions about travel destinations
        </label>
        <textarea
          ref={textareaRef}
          id="travel-input"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-8 py-6 pr-16 sm:px-10 sm:py-8 sm:pr-20 md:px-12 md:py-10 md:pr-24 text-lg sm:text-xl md:text-2xl lg:text-3xl rounded-2xl border-2 border-gray-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 focus:outline-none shadow-xl bg-white placeholder:text-gray-400 transition-all duration-200 hover:border-gray-400 resize-none min-h-[120px] sm:min-h-[140px] md:min-h-[150px] lg:min-h-[180px] disabled:opacity-60 disabled:cursor-not-allowed"
          aria-describedby="char-count travel-help"
          autoFocus
        />

        {/* CAPTCHA Widget - positioned above send button */}
        <CaptchaWidget
          isVisible={isVisible}
          onVerify={handleCaptchaVerify}
          onExpire={() => setCaptchaToken(null)}
          onError={() => setCaptchaToken(null)}
          className="bottom-16 right-4 sm:bottom-18 sm:right-6 md:bottom-20 md:right-8"
        />

        {/* iPhone-style send button */}
        <button
          type="submit"
          disabled={!value.trim() || !isValid || disabled || (requiresCaptcha && !captchaToken && !isVisible)}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
          aria-label={requiresCaptcha && !captchaToken ? "Complete security check to send message" : "Send message"}
        >
          {requiresCaptcha && !captchaToken && !isVisible ? (
            // Security icon when CAPTCHA is required
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          ) : (
            // Regular send icon
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transform -rotate-45 translate-0.25 -translate-y-0.25"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
})

ConversationInput.displayName = 'ConversationInput'