"use client"

import { useTravelContext } from "@/contexts/TravelContext"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResponsiveTropicalBackground } from "@/components/illustrations"
import { ConversationInput, LoadingSpinner } from "@/components/conversation"
import { useConversation } from "@/hooks"
import { useEffect, useRef } from "react"

export default function HomePage() {
  const { state: travelState, actions: travelActions } = useTravelContext()
  const { state: conversationState, submitMessage, updateInput } = useConversation()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (message: string) => {
    submitMessage(message)
  }

  const handleInputChange = (value: string) => {
    updateInput(value)
  }

  const handleTripSelect = (trip: { tripId: string }) => {
    travelActions.selectTrip(trip.tripId)
  }

  const handleTripSave = (tripId: string) => {
    if (travelState.savedTrips.includes(tripId)) {
      travelActions.unsaveTrip(tripId)
    } else {
      travelActions.saveTrip(tripId)
    }
  }

  // Intelligent auto-scroll that targets specific AI messages
  useEffect(() => {
    if (scrollAreaRef.current && travelState.chatHistory.length > 0) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        const lastMessage = travelState.chatHistory[travelState.chatHistory.length - 1]

        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          if (lastMessage?.role === 'assistant') {
            // Find the actual AI message element in the DOM
            const messageElement = document.querySelector(`[data-message-id="${lastMessage.id}"]`)

            if (messageElement) {
              // Responsive positioning: mobile shows beginning, desktop shows more context
              const isMobile = window.innerWidth < 768


              // Scroll to the AI message with responsive positioning
              messageElement.scrollIntoView({
                behavior: 'smooth',
                block: isMobile ? 'start' : 'center', // Mobile: top 20%, Desktop: center 50%
                inline: 'nearest'
              })
            } else {
              // Fallback to old buffer method if DOM targeting fails
              const scrollHeight = scrollElement.scrollHeight
              const clientHeight = scrollElement.clientHeight
              const maxScroll = scrollHeight - clientHeight
              const isMobile = window.innerWidth < 768
              const buffer = isMobile ? 250 : 100
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
  }, [travelState.chatHistory.length, travelState.chatHistory]) // Only trigger on new messages, not trip updates


  return (
    <div className="h-screen relative overflow-hidden">
      {/* Tropical Background - Full Height */}
      <div className="fixed inset-0 z-0">
        <ResponsiveTropicalBackground />
      </div>

      {/* Sky Gradient Overlay - Top quarter of screen */}
      <div className="fixed inset-0 z-10 sky-gradient-overlay" style={{ height: '25vh' }}></div>

      {/* Floating Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-white drop-shadow-lg">
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">DreamVoyager</div>
            <div className="text-xs md:text-sm opacity-90">AI Travel</div>
          </div>
        </div>
      </div>

      {/* Initial Welcome Message - Always centered when no messages */}
      {!travelState.chatHistory.length && (
        <div className="absolute inset-0 flex items-center justify-center z-40" style={{ bottom: '320px' }}>
          <div className="text-center">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-7xl drop-shadow-sm">
              Your AI Travel Planning
              <span className="text-sky-600"> Assistant</span>
            </h1>
            <p className="text-lg text-gray-700 sm:text-xl md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              Tell me about your dream trip
            </p>
          </div>
        </div>
      )}

      {/* Scrollable AI Responses Area - Absolute positioned */}
      <div className="absolute inset-0 z-50 bottom-[200px] md:bottom-[280px]">
        <div className="relative h-full">
          <ScrollArea ref={scrollAreaRef} className="h-full px-4">
            <div className="mx-auto max-w-4xl w-full h-full flex flex-col justify-end">
              <div className="space-y-6 py-8 pb-6 sm:pb-8 md:pb-12">
                {/* Display All Chat Messages with Associated Trip Cards */}
                {travelState.chatHistory
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message) => {
                    // Get trips associated with this message
                    const associatedTrips = travelActions.getTripsByMessageId(message.id) || []


                    return (
                      <div key={message.id} data-message-id={message.id} className="mb-6">
                        {message.role === 'user' ? (
                          /* User Message Bubble */
                          <div className="flex justify-end">
                            <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%]">
                              <div className="bg-sky-100/95 backdrop-blur rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-sky-200/20 chat-bubble-user">
                                <p className="text-base sm:text-lg text-gray-800">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* AI Message Bubble with Optional Trip Cards */
                          <div>
                            <div className="flex justify-start mb-4">
                              <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%]">
                                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-white/20 chat-bubble-ai">
                                  <p className="text-base sm:text-lg text-gray-800">{message.content}</p>
                                </div>
                              </div>
                            </div>

                            {/* Display Trip Cards for this AI message */}
                            {associatedTrips.length > 0 && (
                              <div className="mt-6 mb-4">
                                <div className="grid gap-6 md:grid-cols-3">
                                  {associatedTrips.map((trip) => (
                                    <Card key={trip.tripId} className="bg-white/95 backdrop-blur border-white/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden" onClick={() => handleTripSelect(trip)}>
                                      {/* Cover Image Placeholder */}
                                      <div className="h-24 sm:h-28 md:h-32 bg-gradient-to-br from-sky-400 via-emerald-400 to-amber-400 relative">
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 sm:h-8 sm:w-8 bg-white/20 hover:bg-white/30 backdrop-blur"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleTripSave(trip.tripId)
                                            }}
                                          >
                                            <svg
                                              className={`w-4 h-4 sm:w-5 sm:h-5 ${travelState.savedTrips.includes(trip.tripId) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                                              fill={travelState.savedTrips.includes(trip.tripId) ? 'currentColor' : 'none'}
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                          </Button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                                          <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">{trip.destination}</h3>
                                        </div>
                                      </div>

                                      <CardHeader className="p-3 sm:p-4 pb-3 sm:pb-4">
                                        <CardDescription className="text-sm sm:text-base font-semibold text-gray-700">
                                          {trip.duration} days • ${trip.estimatedCost.toLocaleString()}
                                        </CardDescription>
                                        <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{trip.description}</p>
                                          <div className="flex flex-wrap gap-1 sm:gap-2">
                                            {trip.highlights.slice(0, 3).map((highlight, idx) => (
                                              <span key={idx} className="inline-block rounded-full bg-sky-100 px-2 py-1 sm:px-3 text-xs font-medium text-sky-800">
                                                {highlight}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </CardHeader>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}


                {/* Loading Spinner */}
                {conversationState.isLoading && (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Gradient fade overlay at bottom - matches flat tropical background */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10" style={{ background: 'linear-gradient(to top, var(--sky-light) 0%, transparent 100%)' }}></div>
        </div>
      </div>

      {/* Fixed Input Section at Bottom - Absolute positioned */}
      <div className="absolute left-0 right-0 border-t border-white/20 px-3 py-3 sm:px-4 sm:py-4 md:py-6 z-50 bottom-[15px] md:bottom-[70px]">
        <div className="mx-auto max-w-4xl w-full">
          <ConversationInput
            value={conversationState.userInput}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            disabled={conversationState.isLoading}
            maxLength={750}
          />
        </div>
      </div>


    </div>
  )
}
