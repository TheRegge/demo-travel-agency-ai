/**
 * TripCard Component
 * Displays individual trip recommendations with save/select functionality
 */

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TripCardProps } from '@/types/conversation'
import { EnhancedTripRecommendation } from '@/types/travel'
import { getDestinationPhoto, getDestinationGradient } from '@/services/photoService'

export const TripCard = ({
  trip,
  onSelect,
  onSave,
  isSaved = false
}: TripCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [photoData, setPhotoData] = useState<{
    imageUrl: string;
    altText: string;
    attribution?:   {
      photographer: string;
      username: string;
    };
  } | null>(null)
  const [photoLoading, setPhotoLoading] = useState(true)
  const [photoError, setPhotoError] = useState(false)

  // Fetch destination photo on component mount
  useEffect(() => {
    const fetchPhoto = async () => {
      setPhotoLoading(true)
      setPhotoError(false)
      
      try {
        const photo = await getDestinationPhoto(trip.destination)
        setPhotoData(photo)
      } catch (error) {
        console.error('Error fetching destination photo:', error)
        setPhotoError(true)
      } finally {
        setPhotoLoading(false)
      }
    }

    fetchPhoto()
  }, [trip.destination])

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
      className="cursor-pointer hover:shadow-xl focus:shadow-xl focus:ring-4 focus:ring-sky-500/20 focus:outline-none transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] bg-white border-gray-200 rounded-2xl overflow-hidden p-0"
      onClick={(e) => {
        handleSelect()
      }}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
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
      {/* Destination Photo Header */}
      <div className="relative h-48 w-full overflow-hidden">
        {photoLoading ? (
          // Loading skeleton
          <div className={`h-full w-full animate-pulse ${getDestinationGradient(trip.destination)}`}>
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : photoData?.imageUrl && !photoError ? (
          // Photo loaded successfully
          <>
            <img
              src={photoData.imageUrl}
              alt={photoData.altText}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setPhotoError(true)}
            />
            {/* Photo attribution */}
            {photoData.attribution && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                Photo by{' '}
                <a 
                  href={`https://unsplash.com/@${photoData.attribution.username}?utm_source=travel-agency&utm_medium=referral`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {photoData.attribution.photographer}
                </a>
              </div>
            )}
          </>
        ) : (
          // Fallback gradient
          <div className={`h-full w-full ${getDestinationGradient(trip.destination)}`}>
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-lg font-medium opacity-80">
                {trip.destination}
              </div>
            </div>
          </div>
        )}
      </div>

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

        {/* Description with real data enhancement */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {trip.description}
        </p>

        {/* Data source indicators */}
        {(trip as EnhancedTripRecommendation).dataSource ? (
          <div className="mb-4">
            {/* Main data source badge */}
            <div className="flex items-center gap-2 mb-3">
              {(trip as EnhancedTripRecommendation).dataSource === 'hybrid' ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
                  <span className="text-sm font-semibold text-gray-800">Enhanced with Real APIs</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">LIVE DATA</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm font-semibold text-gray-600">Mock Data Only</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">DEMO</span>
                </>
              )}
            </div>

            {/* API status indicators */}
            {(trip as EnhancedTripRecommendation).apiSources && (
              <div className="flex flex-wrap gap-2">
                {(trip as EnhancedTripRecommendation).apiSources.countryData && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-blue-700 font-medium">Countries API</span>
                  </div>
                )}
                {(trip as EnhancedTripRecommendation).apiSources.weatherData && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-orange-700 font-medium">Weather API</span>
                  </div>
                )}
                {(trip as EnhancedTripRecommendation).apiSources.attractionsData && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-purple-700 font-medium">Geoapify API</span>
                  </div>
                )}
                {(trip as EnhancedTripRecommendation).apiSources.flightData && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-700 font-medium">Amadeus API</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick preview of real data */}
            {(trip as EnhancedTripRecommendation).realData && (
              <div className="mt-3 p-2 bg-white border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 gap-1">
                  {(trip as EnhancedTripRecommendation).realData?.weather && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Weather:</span> {(trip as EnhancedTripRecommendation).realData!.weather!.current.weather.description}, {(trip as EnhancedTripRecommendation).realData!.weather!.current.temp}°C
                    </div>
                  )}
                  {(trip as EnhancedTripRecommendation).realData?.countryInfo && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Currency:</span> {(trip as EnhancedTripRecommendation).realData!.countryInfo.currency}
                      {(trip as EnhancedTripRecommendation).realData!.countryInfo.languages.length > 0 && (
                        <span className="ml-2">
                          <span className="font-medium">Language:</span> {(trip as EnhancedTripRecommendation).realData!.countryInfo.languages[0]}
                        </span>
                      )}
                    </div>
                  )}
                  {(trip as EnhancedTripRecommendation).realData?.attractions && (trip as EnhancedTripRecommendation).realData!.attractions!.length > 0 && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Attractions:</span> {(trip as EnhancedTripRecommendation).realData!.attractions!.length} real locations • <span className="text-blue-600 font-medium">Click to see details</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Fallback for regular trips without API data */
          <div className="mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-sm text-gray-500">Standard trip data</span>
          </div>
        )}

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