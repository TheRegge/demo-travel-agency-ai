"use client"

import { useTravelContext } from "@/contexts/TravelContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResponsiveTropicalBackground } from "@/components/illustrations"
import { ConversationInput, LoadingSpinner } from "@/components/conversation"
import { Logo } from "@/components/layout/Logo"
import { WelcomeMessage } from "@/components/chat/WelcomeMessage"
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble"
import { InlineTripCard } from "@/components/trips/InlineTripCard"
import { useConversation } from "@/hooks"
import { useAutoScroll } from "@/hooks/useAutoScroll"
import { useRef } from "react"
import { SPACING, Z_INDEX } from "@/lib/constants/layout"

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

  // Use extracted auto-scroll hook
  useAutoScroll({ 
    scrollAreaRef, 
    chatHistory: travelState.chatHistory 
  })


  return (
    <main className="h-screen relative overflow-hidden" role="main" aria-label="DreamVoyager AI Travel Assistant">
      {/* Tropical Background - Full Height */}
      <div className="fixed inset-0 z-0">
        <ResponsiveTropicalBackground />
      </div>

      {/* Sky Gradient Overlay - Top quarter of screen */}
      <div className="fixed inset-0 z-10 sky-gradient-overlay" style={{ height: '25vh' }}></div>

      {/* Floating Logo */}
      <header className="absolute top-4 left-4 sm:top-6 sm:left-6" style={{ zIndex: Z_INDEX.header }} role="banner">
        <Logo />
      </header>

      {/* Initial Welcome Message - Always centered when no messages */}
      {!travelState.chatHistory.length && (
        <section className="absolute inset-0 flex items-center justify-center" style={{ bottom: '320px', zIndex: Z_INDEX.content }} aria-labelledby="welcome-heading">
          <WelcomeMessage />
        </section>
      )}

      {/* Scrollable AI Responses Area - Absolute positioned */}
      <section className={`absolute inset-0 ${SPACING.bottomOffset}`} style={{ zIndex: Z_INDEX.chat }} role="log" aria-live="polite" aria-label="Chat conversation">
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
                          <ChatMessageBubble message={message} />
                        ) : (
                          <div>
                            <ChatMessageBubble message={message} className="mb-4" />
                            
                            {/* Display Trip Cards for this AI message */}
                            {associatedTrips.length > 0 && (
                              <div className="mt-6 mb-4">
                                <div className="grid gap-6 md:grid-cols-3">
                                  {associatedTrips.map((trip) => (
                                    <InlineTripCard
                                      key={trip.tripId}
                                      trip={trip}
                                      onSelect={handleTripSelect}
                                      onSave={handleTripSave}
                                      isSaved={travelState.savedTrips.includes(trip.tripId)}
                                    />
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
      </section>

      {/* Fixed Input Section at Bottom - Absolute positioned */}
      <section className={`absolute left-0 right-0 border-t border-white/20 ${SPACING.containerPadding} py-3 sm:py-4 md:py-6 ${SPACING.inputBottomOffset}`} style={{ zIndex: Z_INDEX.chat }} role="complementary" aria-label="Chat input">
        <div className="mx-auto max-w-4xl w-full">
          <ConversationInput
            value={conversationState.userInput}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            disabled={conversationState.isLoading}
            maxLength={750}
          />
        </div>
      </section>


    </main>
  )
}
