"use client"

export function LoadingSpinner() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* AI Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white text-xs font-semibold flex-shrink-0">
          AI
        </div>
        
        {/* Beach Ball Loading Animation */}
        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Beach Ball */}
              <div className="w-6 h-6 rounded-full animate-bounce" style={{
                background: 'linear-gradient(45deg, #ef4444 0%, #ef4444 25%, #3b82f6 25%, #3b82f6 50%, #10b981 50%, #10b981 75%, #f59e0b 75%, #f59e0b 100%)',
                animationDuration: '1s'
              }} />
              
              {/* Subtle glow */}
              <div className="absolute inset-0 w-6 h-6 rounded-full bg-white/20 animate-pulse" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Planning your perfect trip...</span>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "200ms" }} />
                <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "400ms" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}