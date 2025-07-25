"use client"

import { useState, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false, 
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled && value.trim()) {
      e.preventDefault()
      onSend(value.trim())
    }
  }

  const handleSendClick = () => {
    if (!disabled && value.trim()) {
      onSend(value.trim())
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-12 py-3 text-base rounded-full border-gray-300 focus:border-sky-500 focus:ring-sky-500"
        />
        <Button
          onClick={handleSendClick}
          disabled={disabled || !value.trim()}
          size="sm"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-sky-100 disabled:opacity-50"
        >
          <Send className={`h-4 w-4 ${value.trim() && !disabled ? 'text-sky-600' : 'text-gray-400'}`} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      
      {/* Quick Suggestions */}
      {!disabled && value === "" && (
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange("I'm planning a family vacation to Orlando with a $3000 budget")}
            className="text-xs rounded-full px-3 py-1 h-auto hover:bg-sky-50 hover:border-sky-300 transition-colors"
          >
            🎢 Family Trip
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange("Show me budget-friendly European destinations under $1500")}
            className="text-xs rounded-full px-3 py-1 h-auto hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
          >
            🏰 Budget Europe
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange("Need a quick weekend getaway from NYC, under $500 total")}
            className="text-xs rounded-full px-3 py-1 h-auto hover:bg-amber-50 hover:border-amber-300 transition-colors"
          >
            🗽 Weekend Trip
          </Button>
        </div>
      )}
    </div>
  )
}