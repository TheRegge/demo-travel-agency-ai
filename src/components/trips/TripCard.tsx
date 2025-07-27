/**
 * TripCard Component
 * Displays individual trip recommendations with save/select functionality
 */

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TripCardProps } from '@/types/conversation'

export const TripCard = ({
  trip,
  onSelect,
  onSave,
  isSaved = false
}: TripCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleSelect = () => {
    onSelect?.(trip)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave?.(trip.tripId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-xl focus:shadow-xl focus:ring-4 focus:ring-sky-500/20 focus:outline-none transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] bg-white border-gray-200 rounded-2xl overflow-hidden"
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSelect()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${trip.destination} trip`}
    >
      <CardHeader className="p-6">
        {/* Header with destination and save button */}
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
            {trip.destination}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={`shrink-0 ml-3 transition-colors ${
              isSaved 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill={isSaved ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </Button>
        </div>

        {/* Trip details */}
        <CardDescription className="text-lg text-gray-600 mb-4">
          {trip.duration} days • {formatCurrency(trip.estimatedCost)}
        </CardDescription>

        {/* Description */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {trip.description}
        </p>

        {/* Highlights */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {trip.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="inline-block rounded-full bg-gradient-to-r from-sky-100 to-emerald-100 px-3 py-1 text-sm font-medium text-sky-800"
              >
                {highlight}
              </span>
            ))}
            {trip.highlights.length > 3 && (
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                +{trip.highlights.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Trip features */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            {trip.kidFriendly && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Kid-friendly</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
              <span>{trip.season}</span>
            </div>
          </div>
          
          {isHovered && (
            <span className="text-sky-600 font-medium">
              Click to view details →
            </span>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}