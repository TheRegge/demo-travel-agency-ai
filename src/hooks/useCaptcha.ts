/**
 * Custom hook for CAPTCHA management
 * Handles CAPTCHA token state and integration with security validation
 */

import { useState, useCallback } from 'react'

export interface UseCaptchaReturn {
  captchaToken: string | null
  isVisible: boolean
  setCaptchaToken: (token: string | null) => void
  showCaptcha: () => void
  hideCaptcha: () => void
  resetCaptcha: () => void
}

export const useCaptcha = (): UseCaptchaReturn => {
  const [captchaToken, setCaptchaTokenState] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const setCaptchaToken = useCallback((token: string | null) => {
    setCaptchaTokenState(token)
    // Auto-hide CAPTCHA when token is received
    if (token) {
      setIsVisible(false)
    }
  }, [])

  const showCaptcha = useCallback(() => {
    setIsVisible(true)
  }, [])

  const hideCaptcha = useCallback(() => {
    setIsVisible(false)
  }, [])

  const resetCaptcha = useCallback(() => {
    setCaptchaTokenState(null)
    setIsVisible(false)
  }, [])

  return {
    captchaToken,
    isVisible,
    setCaptchaToken,
    showCaptcha,
    hideCaptcha,
    resetCaptcha
  }
}