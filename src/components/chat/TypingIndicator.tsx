"use client"

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* AI Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white text-xs font-semibold flex-shrink-0">
          AI
        </div>
        
        {/* Typing Animation */}
        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="ml-2 text-xs text-gray-500">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  )
}