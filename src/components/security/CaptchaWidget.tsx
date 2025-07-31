/**
 * CAPTCHA Widget Component
 * Conditionally displays Google reCAPTCHA when security service detects suspicious activity
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { motion, AnimatePresence } from 'framer-motion'

interface CaptchaWidgetProps {
  isVisible: boolean
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  className?: string
}

export const CaptchaWidget = ({
  isVisible = false,
  onVerify,
  onExpire,  
  onError,
  className = ''
}: CaptchaWidgetProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Get site key from environment
  const siteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY

  // Reset CAPTCHA when visibility changes
  useEffect(() => {
    if (!isVisible && recaptchaRef.current) {
      recaptchaRef.current.reset()
      setError(null)
      setIsLoading(false)
    }
  }, [isVisible])

  const handleVerify = (token: string | null) => {
    if (token) {
      setIsLoading(false)
      setError(null)
      onVerify(token)
    }
  }

  const handleExpire = () => {
    setError('CAPTCHA expired. Please try again.')
    onExpire?.()
  }

  const handleError = () => {
    setError('CAPTCHA failed to load. Please refresh the page.')
    onError?.()
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Don't render if no site key configured
  if (!siteKey) {
    console.warn('CAPTCHA site key not configured')
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ 
            duration: 0.2,
            ease: 'easeOut'
          }}
          className={`absolute bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 ${className}`}
        >
          {/* Header */}
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 mr-2 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Security Check</span>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-500 border-t-transparent"></div>
              <span className="ml-2 text-sm text-gray-600">Loading...</span>
            </div>
          )}

          {/* CAPTCHA Widget */}
          <div className={isLoading ? 'opacity-50' : ''}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onChange={handleVerify}
              onExpired={handleExpire}
              onErrored={handleError}
              onLoad={handleLoad}
              size="compact"
              theme="light"
            />
          </div>

          {/* Helper text */}
          <p className="text-xs text-gray-500 mt-2">
            Please verify you're human to continue
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CaptchaWidget