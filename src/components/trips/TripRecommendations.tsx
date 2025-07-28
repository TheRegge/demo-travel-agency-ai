/**
 * TripRecommendations Component
 * Displays a responsive grid of trip recommendations below the homepage conversation area
 */

import { useState } from 'react'
import { TripRecommendationsProps } from '@/types/conversation'
import { TripRecommendation } from '@/types/travel'
import { TripCard } from './TripCard'
import { TripDetailModal } from './TripDetailModal'
import { LoadingSpinner } from '@/components/conversation/LoadingSpinner'

export const TripRecommendations = ({
  trips,
  onTripSelect,
  onTripSave,
  savedTripIds = [],
  isLoading = false
}: TripRecommendationsProps) => {
  const [selectedTrip, setSelectedTrip] = useState<TripRecommendation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)



  const handleTripSelect = (trip: TripRecommendation) => {
    setSelectedTrip(trip)
    setIsModalOpen(true)
    onTripSelect?.(trip)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedTrip(null)
  }

  const handleModalSave = (tripId: string) => {
    onTripSave?.(tripId)
  }
  
  // Temporarily always render for debugging
  // TODO: Restore original logic after debugging
  // if (!isLoading && trips.length === 0) {
  //   return null
  // }

  return (
    <>

      <section className="px-4 py-16 bg-gradient-to-b from-white to-sky-50">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              AI Recommended Trips for You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your preferences, here are some amazing destinations I&apos;ve carefully selected for your perfect getaway
            </p>
          </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Trip Grid */}
        {!isLoading && trips.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip.tripId}
                className="animate-fadeInUp"
                style={{
                  animationDelay: `${trips.indexOf(trip) * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                <TripCard
                  trip={trip}
                  onSelect={(selectedTrip) => {
                    handleTripSelect(selectedTrip)
                  }}
                  onSave={onTripSave ? onTripSave : undefined}
                  isSaved={savedTripIds.includes(trip.tripId)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && trips.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg 
                className="w-24 h-24 text-gray-400 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No trips found yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Share your travel dreams above and I&apos;ll create personalized recommendations just for you!
            </p>
          </div>
        )}

        {/* Trip Detail Modal */}
        <TripDetailModal
          trip={selectedTrip}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
          isSaved={selectedTrip ? savedTripIds.includes(selectedTrip.tripId) : false}
        />
      </div>
    </section>
    </>
  )
}