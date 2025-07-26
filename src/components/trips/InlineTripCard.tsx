/**
 * Inline Trip Card Component
 * Compact trip card specifically for inline display within chat messages
 */

import { Card, CardHeader, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TripRecommendation } from "@/types/travel"

interface InlineTripCardProps {
  trip: TripRecommendation
  onSelect: (trip: { tripId: string }) => void
  onSave: (tripId: string) => void
  isSaved: boolean
  className?: string
}

export const InlineTripCard = ({ 
  trip, 
  onSelect, 
  onSave, 
  isSaved, 
  className = "" 
}: InlineTripCardProps) => {
  const handleSelect = () => {
    onSelect(trip)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave(trip.tripId)
  }

  return (
    <Card 
      key={trip.tripId} 
      className={`bg-white/95 backdrop-blur border-white/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden ${className}`} 
      onClick={handleSelect}
    >
      {/* Cover Image Placeholder */}
      <div className="h-24 sm:h-28 md:h-32 bg-gradient-to-br from-sky-400 via-emerald-400 to-amber-400 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 bg-white/20 hover:bg-white/30 backdrop-blur"
            onClick={handleSave}
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`}
              fill={isSaved ? 'currentColor' : 'none'}
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
  )
}