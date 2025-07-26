"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"
import { LoadingSpinner } from "./LoadingSpinner"
import { mockConversations, ConversationType } from "@/lib/mock-conversations"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  status?: "sending" | "sent" | "error"
}

interface ChatContainerProps {
  initialQuery?: string
}

export function ChatContainer({ initialQuery = "" }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI travel planning assistant. I can help you discover amazing destinations, create personalized itineraries, and find the perfect trip within your budget. What kind of adventure are you dreaming of?",
      sender: "assistant",
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showExamples, setShowExamples] = useState(true)

  // Automatically send the initial query when component mounts
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery)
    }
  }, [])

  const loadMockConversation = (type: ConversationType) => {
    setShowExamples(false)
    setMessages(mockConversations[type])
  }

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI travel planning assistant. I can help you discover amazing destinations, create personalized itineraries, and find the perfect trip within your budget. What kind of adventure are you dreaming of?",
        sender: "assistant",
        timestamp: new Date()
      }
    ])
    setShowExamples(true)
    setInputValue("")
    setIsTyping(false)
  }

  const handleSendMessage = (content: string) => {
    setShowExamples(false)
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: "That sounds wonderful! Let me help you plan the perfect trip. Could you tell me more about your budget, travel dates, and any specific preferences you have?",
        sender: "assistant",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-white text-sm font-semibold">
            AI
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Travel Planning Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              <p className="text-sm text-gray-500">
                {isTyping ? "Typing..." : "Online • Ready to help"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Reset Button */}
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetChat}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Chat
          </Button>
        )}
      </div>

      {/* Messages Container */}
      <Card className="flex-1 overflow-hidden bg-white border-x border-gray-200 rounded-none">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <LoadingSpinner />}
          
          {/* Example Conversations */}
          {showExamples && messages.length === 1 && (
            <div className="mt-8 p-4 bg-sky-50 rounded-2xl border border-sky-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                💡 Try these conversation examples:
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMockConversation('familyTrip')}
                  className="text-left h-auto p-3 justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">🎢 Family Orlando Trip</div>
                    <div className="text-xs text-gray-500">$3,000 budget with kids</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMockConversation('budgetEurope')}
                  className="text-left h-auto p-3 justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">🏰 Budget Europe Solo</div>
                    <div className="text-xs text-gray-500">$1,500 college grad trip</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMockConversation('adventureTravel')}
                  className="text-left h-auto p-3 justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">🏔️ Iceland Adventure</div>
                    <div className="text-xs text-gray-500">$4,000 photography trip</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMockConversation('quickHelp')}
                  className="text-left h-auto p-3 justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">🗽 NYC Weekend Getaway</div>
                    <div className="text-xs text-gray-500">Under $500 quick trip</div>
                  </div>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Click any example to see a full conversation, or start typing your own question below.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
        <MessageInput 
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isTyping}
          placeholder="Tell me about your dream destination..."
        />
      </div>
    </div>
  )
}