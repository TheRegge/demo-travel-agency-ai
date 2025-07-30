"use client"

import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  status?: "sending" | "sent" | "error"
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user"
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start gap-1 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 ${
          isUser 
            ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white" 
            : "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white"
        }`}>
          {isUser ? "You" : "AI"}
        </div>
        
        {/* Message Content with tail using CSS classes */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser 
              ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white chat-bubble-user" 
              : "bg-gray-100 text-gray-900 chat-bubble-ai"
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          
          {/* Timestamp and Status */}
          <div className={`flex items-center gap-2 mt-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {isUser && message.status && (
              <div className="flex items-center">
                {message.status === "sending" && (
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                )}
                {message.status === "sent" && (
                  <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {message.status === "error" && (
                  <svg className="h-3 w-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}