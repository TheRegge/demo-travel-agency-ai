/**
 * Chat Message Bubble Component
 * Enhanced message bubble for the main chat interface with trip card support
 */

import { ChatMessage } from "@/types/app"

interface ChatMessageBubbleProps {
  message: ChatMessage
  className?: string
}

export const ChatMessageBubble = ({ message, className = "" }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%]`}>
        <div className={`
          backdrop-blur rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border
          ${isUser 
            ? 'bg-sky-100/95 border-sky-200/20 chat-bubble-user' 
            : 'bg-white/95 border-white/20 chat-bubble-ai'
          }
        `}>
          <p className="text-base sm:text-lg text-gray-800">{message.content}</p>
        </div>
      </div>
    </div>
  )
}