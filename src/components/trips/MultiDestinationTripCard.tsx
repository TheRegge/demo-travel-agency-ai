/**
 * Multi-Destination Trip Card Component
 * Enhanced card for displaying complex multi-destination itineraries with transport connections
 */

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TripRecommendation } from "@/types/travel"
import { getTransportIcon, getTransportDisplayName } from "@/lib/mock-data/transportation"
import { ChevronDown, ChevronUp, MapPin, Clock, DollarSign, Users } from "lucide-react"

interface MultiDestinationTripCardProps {
  trip: TripRecommendation
  onSelect: (trip: { tripId: string }) => void
  onSave: (tripId: string) => void
  isSaved: boolean
  className?: string
}

export const MultiDestinationTripCard = ({ 
  trip, 
  onSelect, 
  onSave, 
  isSaved, 
  className = "" 
}: MultiDestinationTripCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedLeg, setSelectedLeg] = useState<string | null>(null)

  const handleSelect = () => {
    onSelect(trip)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave(trip.tripId)
  }

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleLegClick = (legId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedLeg(selectedLeg === legId ? null : legId)
  }

  if (!trip.itinerary) {
    return null // Fallback for non-multi-destination trips
  }

  const { itinerary } = trip

  return (
    <Card 
      className={`bg-white/95 backdrop-blur border-white/20 shadow-xl hover:shadow-2xl focus:shadow-2xl focus:ring-4 focus:ring-sky-500/20 focus:outline-none transition-all cursor-pointer overflow-hidden ${className}`}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSelect()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${trip.destination} multi-destination trip`}
    >
      {/* Header with Trip Overview */}
      <div className="relative">
        {/* Hero Image Placeholder */}
        <div className="h-32 sm:h-36 md:h-40 bg-gradient-to-r from-emerald-400 via-sky-500 to-purple-500 relative">
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Save Button */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur"
              onClick={handleSave}
            >
              <svg
                className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`}
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </div>

          {/* Trip Title and Type Badge */}
          <div className="absolute bottom-3 left-3 right-12">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                Multi-Destination
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/90 text-white border-white/30 text-xs">
                {itinerary.legs.length} Cities
              </Badge>
            </div>
            <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-lg leading-tight">
              {trip.destination}
            </h3>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-white/90 backdrop-blur px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{trip.duration} days</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">${trip.estimatedCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{itinerary.totalDistance}</span>
              </div>
            </div>
            {trip.kidFriendly && (
              <div className="flex items-center gap-1 text-emerald-600">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Family Friendly</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>

        {/* Transport Summary */}
        <div className="bg-sky-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Transportation</p>
              <p className="text-xs text-gray-500">{itinerary.transportSummary}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">${itinerary.totalTransportCost}</p>
              <p className="text-xs text-gray-500">transport cost</p>
            </div>
          </div>
        </div>

        {/* Itinerary Timeline Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">Itinerary Overview</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleToggleExpanded}
              className="text-xs text-sky-600 hover:text-sky-700"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Less details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  More details
                </>
              )}
            </Button>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            {itinerary.legs.map((leg, index) => (
              <div key={leg.legId} className="relative">
                {/* Timeline Line */}
                {index < itinerary.legs.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200"></div>
                )}
                
                {/* Leg Card */}
                <div 
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedLeg === leg.legId 
                      ? 'bg-sky-50 border-sky-200' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={(e) => handleLegClick(leg.legId, e)}
                >
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-sky-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-sky-600">{index + 1}</span>
                  </div>

                  {/* Leg Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-gray-800 text-sm truncate">{leg.destination}</h5>
                      <span className="text-xs text-gray-500 flex-shrink-0">{leg.duration} days</span>
                    </div>
                    
                    {!isExpanded && (
                      <p className="text-xs text-gray-600 line-clamp-1">{leg.description}</p>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && selectedLeg === leg.legId && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-gray-600">{leg.description}</p>
                        
                        {/* Highlights */}
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Highlights:</p>
                          <div className="flex flex-wrap gap-1">
                            {leg.highlights.slice(0, 3).map((highlight, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Cost */}
                        <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                          <span className="text-xs text-gray-500">Leg cost:</span>
                          <span className="text-xs font-medium text-gray-700">${leg.estimatedCost.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transport to Next Destination */}
                {leg.transportToNext && (
                  <div className="ml-11 mt-2 mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-md px-2 py-1.5">
                      <span className="text-lg">{getTransportIcon(leg.transportToNext.method)}</span>
                      <span>{getTransportDisplayName(leg.transportToNext.method)}</span>
                      <span>•</span>
                      <span>{leg.transportToNext.duration}</span>
                      <span>•</span>
                      <span className="font-medium">${leg.transportToNext.cost}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button 
            onClick={handleSelect}
            className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white"
          >
            View Complete Itinerary
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default MultiDestinationTripCard