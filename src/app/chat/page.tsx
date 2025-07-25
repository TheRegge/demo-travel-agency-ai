"use client"

import { useSearchParams } from "next/navigation"
import { ChatContainer } from "@/components/chat"
import { ResponsiveTropicalBackground } from "@/components/illustrations"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  return (
    <div className="min-h-screen relative">
      {/* Tropical Background */}
      <div className="absolute inset-0">
        <ResponsiveTropicalBackground />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">
              Plan Your Perfect Trip
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Chat with our AI travel assistant to discover personalized recommendations, 
              detailed itineraries, and budget-friendly options.
            </p>
          </div>

          {/* Chat Interface */}
          <div className="flex justify-center">
            <ChatContainer initialQuery={initialQuery} />
          </div>

          {/* Usage Tips */}
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Better Results</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                Mention your budget to get tailored recommendations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                Include travel dates for seasonal pricing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                Specify if you're traveling with kids or have special needs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                Ask about specific destinations or activities you're interested in
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}