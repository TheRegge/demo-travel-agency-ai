/**
 * Custom hook for rotating through funny loading messages
 * Adds personality to loading states while reminding users this is a portfolio demo
 */

import { useState, useEffect } from 'react'

const FUNNY_LOADING_MESSAGES = [
  "Creating your perfect trip... (This is Regis' portfolio, but the AI is real!) ✈️",
  "Consulting our imaginary travel experts... 🏝️",
  "Real AI, fake travel agency - crafting your dream vacation! 🌴",
  "Generating epic adventures for Regis' demo... 🗺️",
  "Our virtual travel agents are working overtime! 🏖️",
  "Portfolio magic in progress... real recommendations incoming! ⚡",
  "Demo mode: ON. Amazing trips: LOADING... 🚀",
  "Fake agency, real wanderlust - almost ready! 🌺",
  "AI thinking harder than a tourist choosing between beaches... 🤔",
  "Summoning the spirit of wanderlust for this demo! ✨"
]

interface UseRotatingMessagesOptions {
  messages?: string[]
  intervalMs?: number
}

export const useRotatingMessages = (options: UseRotatingMessagesOptions = {}) => {
  const { 
    messages = FUNNY_LOADING_MESSAGES, 
    intervalMs = 2500 
  } = options
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (messages.length <= 1) return

    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false)
      
      // After fade out completes, change message and fade back in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
        setIsVisible(true)
      }, 150) // Half of the CSS transition duration
      
    }, intervalMs)

    return () => clearInterval(interval)
  }, [messages.length, intervalMs])

  return {
    currentMessage: messages[currentIndex] || messages[0] || 'Loading...',
    isVisible,
    messageIndex: currentIndex,
    totalMessages: messages.length
  }
}