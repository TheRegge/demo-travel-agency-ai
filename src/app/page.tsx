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

  const handleTripSelect = (trip: any) => {
    travelActions.selectTrip(trip.tripId)
  }

  const handleTripSave = (tripId: string) => {
    if (travelState.savedTrips.includes(tripId)) {
      travelActions.unsaveTrip(tripId)
    } else {
      travelActions.saveTrip(tripId)
    }
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current && travelState.chatHistory.length > 0) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [travelState.chatHistory.length, travelState.recommendedTrips.length])

  // TEMPORARY: Static mock trips for visual testing
  const mockTripsForTesting = [
    {
      tripId: "orlando-test-1",
      destination: "Orlando, Florida",
      duration: 7,
      estimatedCost: 3200,
      highlights: ["Walt Disney World Resort", "Universal Studios Florida", "Disney Character Dining"],
      description: "The magical theme park capital of the world, home to Disney World, Universal Studios, and countless family attractions. Perfect for creating unforgettable memories with children of all ages.",
      activities: ["Walt Disney World Resort", "Universal Studios Florida", "Disney Character Dining", "SeaWorld Orlando", "ICON Park"],
      season: "spring",
      kidFriendly: true,
      customizations: {
        hotelType: "standard" as const,
        activities: ["Walt Disney World Resort", "Universal Studios Florida", "Disney Character Dining"]
      },
      score: 95
    },
    {
      tripId: "prague-test-2",
      destination: "Prague, Czech Republic",
      duration: 5,
      estimatedCost: 2800,
      highlights: ["Prague Castle Complex", "Charles Bridge Walk", "Old Town Square"],
      description: "A fairy-tale city with stunning medieval architecture, rich history, and affordable luxury. Explore cobblestone streets, magnificent castles, and enjoy world-class beer culture.",
      activities: ["Prague Castle Complex", "Charles Bridge Walk", "Old Town Square", "Czech Beer Tour", "Vltava River Cruise"],
      season: "spring",
      kidFriendly: true,
      customizations: {
        hotelType: "standard" as const,
        activities: ["Prague Castle Complex", "Charles Bridge Walk", "Old Town Square"]
      },
      score: 88
    },
    {
      tripId: "california-test-3",
      destination: "California Coast",
      duration: 8,
      estimatedCost: 4100,
      highlights: ["Big Sur Scenic Drive", "Monterey Bay Aquarium", "Santa Barbara Wine Country"],
      description: "Experience the stunning Pacific coastline with dramatic cliffs, charming seaside towns, and world-renowned wine regions. Perfect for scenic drives and coastal adventures.",
      activities: ["Big Sur Scenic Drive", "Monterey Bay Aquarium", "Santa Barbara Wine Country", "Hearst Castle Tour", "Carmel-by-the-Sea"],
      season: "spring",
      kidFriendly: true,
      customizations: {
        hotelType: "luxury" as const,
        activities: ["Big Sur Scenic Drive", "Monterey Bay Aquarium", "Santa Barbara Wine Country"]
      },
      score: 92
    }
  ]

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Tropical Background - Full Height */}
      <div className="fixed inset-0 z-0">
        <ResponsiveTropicalBackground />
      </div>

      {/* Sky Gradient Overlay - Top quarter of screen */}
      <div className="fixed inset-0 z-10 sky-gradient-overlay" style={{ height: '25vh' }}></div>

      {/* Floating Logo */}
      <div className="absolute top-6 left-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-white drop-shadow-lg">
            <div className="text-lg font-bold">DreamVoyager</div>
            <div className="text-xs opacity-90">AI Travel</div>
          </div>
        </div>
      </div>

      {/* Initial Welcome Message - Always centered when no messages */}
      {!travelState.chatHistory.length && (
        <div className="absolute inset-0 flex items-center justify-center z-40" style={{ bottom: '320px' }}>
          <div className="text-center">
            <h1 className="mb-8 text-5xl font-bold text-gray-900 md:text-7xl drop-shadow-sm">
              Your AI Travel Planning
              <span className="text-sky-600"> Assistant</span>
            </h1>
            <p className="text-xl text-gray-700 md:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              Tell me about your dream trip
            </p>
          </div>
        </div>
      )}

      {/* Scrollable AI Responses Area - Absolute positioned */}
      <div className="absolute inset-0 z-50" style={{ bottom: '400px' }}>
        <div className="relative h-full">
          <ScrollArea ref={scrollAreaRef} className="h-full px-4">
            <div className="mx-auto max-w-4xl w-full h-full flex flex-col justify-end">
              <div className="space-y-6 py-8 pb-32">
                {/* Display All Chat Messages */}
                {travelState.chatHistory
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message) => (
                    <div key={message.id} className="mb-6">
                      {message.role === 'user' ? (
                        /* User Message Bubble */
                        <div className="flex justify-end">
                          <div className="max-w-[80%] md:max-w-[70%]">
                            <div className="bg-sky-100/95 backdrop-blur rounded-2xl p-6 shadow-lg border border-sky-200/20 chat-bubble-user">
                              <p className="text-lg text-gray-800">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* AI Message Bubble */
                        <div className="flex justify-start">
                          <div className="max-w-[80%] md:max-w-[70%]">
                            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/20 chat-bubble-ai">
                              <p className="text-lg text-gray-800">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                {/* Display Trip Cards if Available */}
                {travelState.recommendedTrips.length > 0 && (
                  <div className="my-8 mb-24">
                    <div className="grid gap-6 md:grid-cols-3">
                      {travelState.recommendedTrips.map((trip) => (
                        <Card key={trip.tripId} className="bg-white/95 backdrop-blur border-white/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden" onClick={() => handleTripSelect(trip)}>
                          {/* Cover Image Placeholder */}
                          <div className="h-32 bg-gradient-to-br from-sky-400 via-emerald-400 to-amber-400 relative">
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute top-3 right-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleTripSave(trip.tripId)
                                }}
                              >
                                <svg
                                  className={`w-5 h-5 ${travelState.savedTrips.includes(trip.tripId) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                                  fill={travelState.savedTrips.includes(trip.tripId) ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </Button>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <h3 className="text-white font-bold text-xl drop-shadow-lg">{trip.destination}</h3>
                            </div>
                          </div>

                          <CardHeader className="pb-4">
                            <CardDescription className="text-base font-semibold text-gray-700">
                              {trip.duration} days • ${trip.estimatedCost.toLocaleString()}
                            </CardDescription>
                            <div className="mt-3 space-y-3">
                              <p className="text-sm text-gray-600 line-clamp-2">{trip.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {trip.highlights.slice(0, 3).map((highlight, idx) => (
                                  <span key={idx} className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
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
      <div className="absolute left-0 right-0 border-t border-white/20 px-4 py-6 z-50" style={{ bottom: '45px' }}>
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
