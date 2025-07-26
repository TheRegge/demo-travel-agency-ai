/**
 * useAutoScroll Hook
 * Handles intelligent auto-scrolling for chat messages with responsive behavior
 */

import { useEffect, RefObject } from 'react'
import { ChatMessage } from '@/types/app'
import { SCROLL_BUFFERS, BREAKPOINTS } from '@/lib/constants/layout'

interface UseAutoScrollProps {
  scrollAreaRef: RefObject<HTMLDivElement | null>
  chatHistory: ChatMessage[]
}

export const useAutoScroll = ({ scrollAreaRef, chatHistory }: UseAutoScrollProps) => {
  useEffect(() => {
    if (scrollAreaRef.current && chatHistory.length > 0) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        const lastMessage = chatHistory[chatHistory.length - 1]

        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          if (lastMessage?.role === 'assistant') {
            // Find the actual AI message element in the DOM
            const messageElement = document.querySelector(`[data-message-id="${lastMessage.id}"]`)

            if (messageElement) {
              // Responsive positioning: mobile shows beginning, desktop shows more context
              const isMobile = window.innerWidth < BREAKPOINTS.md

              // Scroll to the AI message with responsive positioning
              messageElement.scrollIntoView({
                behavior: 'smooth',
                block: isMobile ? 'start' : 'center',
                inline: 'nearest'
              })
            } else {
              // Fallback to buffer method if DOM targeting fails
              const scrollHeight = scrollElement.scrollHeight
              const clientHeight = scrollElement.clientHeight
              const maxScroll = scrollHeight - clientHeight
              const isMobile = window.innerWidth < BREAKPOINTS.md
              const buffer = isMobile ? SCROLL_BUFFERS.mobile : SCROLL_BUFFERS.desktop
              const targetScroll = Math.max(0, maxScroll - buffer)

              scrollElement.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
              })
            }
          } else {
            // For user messages, scroll to bottom as usual
            scrollElement.scrollTo({
              top: scrollElement.scrollHeight,
              behavior: 'smooth'
            })
          }
        })
      }
    }
  }, [chatHistory.length, chatHistory, scrollAreaRef])
}