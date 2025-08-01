/**
 * Trip Detail Modal Component
 * Displays detailed trip information in a modal dialog using shadcn/ui Dialog
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TripDetailModalProps } from '@/types/conversation'
import { EnhancedTripRecommendation, Hotel } from '@/types/travel'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getDestinationGradient, getDestinationPhoto } from '@/services/photoService'
import { tripCostCalculator, TripConfig, TripCostBreakdown } from '@/services/tripCostCalculator'

// Define FlightOffer type based on the structure in travel.ts
type FlightOffer = {
  id: string
  price: number
  currency: string
  duration: string
  stops: number
  airline: string
  departure: {
    airport: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    time: string
    date: string
  }
}

// Define photo data type
type PhotoData = {
  imageUrl: string
  altText: string
  attribution?: {
    username: string
    photographer: string
  }
}

// Define API Hotel type (from realData.hotels)
type APIHotel = {
  id: string
  name: string
  rating?: string | number
  address?: string
  coordinates?: [number, number]
  minPrice?: number
  pricePerNight?: number
  currency?: string
  amenities?: string[]
  description?: string
  type?: string
  kidFriendly?: boolean
}

// Union type for hotels from different sources
type HotelOption = Hotel | APIHotel

export const TripDetailModal = ({
  trip,
  isOpen,
  onClose,
  onSave,
  isSaved = false
}: TripDetailModalProps) => {

  // Trip configuration state
  const [departureCity, setDepartureCity] = useState('New York')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [checkInDate, setCheckInDate] = useState<string>('')
  const [checkOutDate, setCheckOutDate] = useState<string>('')
  const [selectedHotel, setSelectedHotel] = useState<HotelOption | null>(null)
  const [selectedFlights, setSelectedFlights] = useState<{ outbound: FlightOffer | null, return: FlightOffer | null }>({ outbound: null, return: null })
  const [costBreakdown, setCostBreakdown] = useState<TripCostBreakdown | null>(null)
  const [isCustomizeExpanded, setIsCustomizeExpanded] = useState(false)
  const [isCostExpanded, setIsCostExpanded] = useState(false)

  // Photo data state
  const [photoData, setPhotoData] = useState<PhotoData | null>(null)

  // Load destination photo
  useEffect(() => {
    if (!trip) return

    const fetchPhoto = async () => {
      try {
        const photo = await getDestinationPhoto(trip.destination)
        setPhotoData(photo)
      } catch (error) {
        console.error('Error fetching destination photo:', error)
      }
    }

    fetchPhoto()
  }, [trip])

  // Initialize dates based on trip duration
  useEffect(() => {
    if (trip && !checkInDate) {
      const today = new Date()
      const inDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      const outDate = new Date(inDate.getTime() + trip.duration * 24 * 60 * 60 * 1000)

      const checkIn = inDate.toISOString().split('T')[0]
      const checkOut = outDate.toISOString().split('T')[0]
      setCheckInDate(checkIn || '')
      setCheckOutDate(checkOut || '')
    }
  }, [trip, checkInDate])

  // Auto-select first hotel and flights if available
  useEffect(() => {
    if (!trip) return

    const enhancedTrip = trip as EnhancedTripRecommendation
    const hotels: (APIHotel | Hotel)[] = enhancedTrip.realData?.hotels || (trip as EnhancedTripRecommendation).hotels || []
    const flights = enhancedTrip.realData?.flights || []

    if (hotels.length > 0 && !selectedHotel) {
      setSelectedHotel(hotels[0] || null)
    }
    if (flights.length > 0 && !selectedFlights.outbound) {
      setSelectedFlights({
        outbound: flights[0] || null,
        return: flights[1] || null
      })
    }
  }, [trip, selectedHotel, selectedFlights.outbound])

  // Recalculate costs when configuration changes
  useEffect(() => {
    if (!trip || !checkInDate || !checkOutDate) return

    const config: TripConfig = {
      travelers: { adults, children, infants },
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      ...(selectedHotel && {
        selectedHotel: {
          id: selectedHotel.id,
          name: selectedHotel.name,
          minPrice: ('minPrice' in selectedHotel && selectedHotel.minPrice) ? selectedHotel.minPrice : ('pricePerNight' in selectedHotel ? selectedHotel.pricePerNight : 100),
          currency: ('currency' in selectedHotel && selectedHotel.currency) ? selectedHotel.currency : 'USD'
        }
      }),
      selectedFlights: {
        ...(selectedFlights.outbound && {
          outbound: {
            id: selectedFlights.outbound.id,
            price: selectedFlights.outbound.price,
            airline: selectedFlights.outbound.airline
          }
        }),
        ...(selectedFlights.return && {
          return: {
            id: selectedFlights.return.id,
            price: selectedFlights.return.price,
            airline: selectedFlights.return.airline
          }
        })
      }
    }

    const activities = trip.activityDetails || []
    const breakdown = tripCostCalculator.calculateTripCost(config, activities)
    setCostBreakdown(breakdown)
  }, [adults, children, infants, checkInDate, checkOutDate, selectedHotel, selectedFlights, trip])

  if (!trip) {
    return null
  }

  const handleSave = () => {
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-6xl w-[95vw] sm:!max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-0">
        {/* Hidden Dialog Title for Accessibility */}
        <DialogTitle className="sr-only">{trip.destination} Trip Details</DialogTitle>

        {/* Destination Photo Header */}
        <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
          {photoData?.imageUrl ? (
            <>
              <Image
                src={photoData.imageUrl}
                alt={photoData.altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {trip.destination}
            </h2>
            <p className="text-xl text-white/90 drop-shadow">
              {trip.duration} days • {formatCurrency(trip.estimatedCost)}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Trip Overview */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Overview</h3>
            <p className="text-gray-700 leading-relaxed">{trip.description}</p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {trip.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="inline-block rounded-full bg-gradient-to-r from-sky-100 to-emerald-100 px-4 py-2 text-sm font-medium text-sky-800"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* Trip Configuration */}
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsCustomizeExpanded(!isCustomizeExpanded)}
              className="w-full p-6 text-left hover:bg-sky-100/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Customize Your Trip</span>
                <svg
                  className={`w-5 h-5 text-gray-500 ml-auto transition-transform ${isCustomizeExpanded ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
            </button>

            {isCustomizeExpanded && (
              <div className="px-6 pb-6 border-t border-sky-200/50">

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Travel Dates */}
                  <div>
                    <Label htmlFor="check-in" className="text-sm font-medium text-gray-700">Check-in Date</Label>
                    <Input
                      id="check-in"
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="check-out" className="text-sm font-medium text-gray-700">Check-out Date</Label>
                    <Input
                      id="check-out"
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate}
                      className="mt-1"
                    />
                  </div>

                  {/* Departure City */}
                  <div>
                    <Label htmlFor="departure" className="text-sm font-medium text-gray-700">Departure City</Label>
                    <Input
                      id="departure"
                      type="text"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      placeholder="e.g., New York"
                      className="mt-1"
                    />
                  </div>

                  {/* Travelers */}
                  <div>
                    <Label htmlFor="adults" className="text-sm font-medium text-gray-700">Adults</Label>
                    <Input
                      id="adults"
                      type="number"
                      min="1"
                      max="9"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="children" className="text-sm font-medium text-gray-700">Children (2-11)</Label>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      max="9"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="infants" className="text-sm font-medium text-gray-700">Infants (Under 2)</Label>
                    <Input
                      id="infants"
                      type="number"
                      min="0"
                      max="9"
                      value={infants}
                      onChange={(e) => setInfants(parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Flight Selection */}
                {(trip as EnhancedTripRecommendation).realData?.flights && (trip as EnhancedTripRecommendation).realData!.flights!.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Flights</Label>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Select</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Airline</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Route</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Stops</th>
                              <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(trip as EnhancedTripRecommendation).realData!.flights!.map((flight) => (
                              <tr
                                key={flight.id}
                                className={`border-b border-gray-100 hover:bg-sky-50 cursor-pointer transition-colors ${selectedFlights.outbound?.id === flight.id ? 'bg-sky-50 border-sky-200' : ''
                                  }`}
                                onClick={() => setSelectedFlights(prev => ({
                                  ...prev,
                                  outbound: flight
                                }))}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      name="flight-selection"
                                      checked={selectedFlights.outbound?.id === flight.id}
                                      onChange={() => setSelectedFlights(prev => ({
                                        ...prev,
                                        outbound: flight
                                      }))}
                                      className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                                    />
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-sky-100 rounded-md flex items-center justify-center">
                                      <span className="text-xs font-bold text-sky-700">{flight.airline}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{flight.airline}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{flight.departure.airport}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    <span className="font-medium text-gray-900">{flight.arrival.airport}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {flight.departure.time} → {flight.arrival.time}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-gray-700">
                                    {flight.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${flight.stops === 0
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="font-bold text-gray-900">{formatCurrency(flight.price)}</div>
                                  <div className="text-xs text-gray-500">per person</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <div className="text-xs text-sky-600 bg-sky-50 px-2 py-1 rounded-md inline-block">
                          {(trip as EnhancedTripRecommendation).apiSources.flightData ? 'Live from Amadeus' : 'Sample Data'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hotel Selection */}
                {((trip as EnhancedTripRecommendation).realData?.hotels && (trip as EnhancedTripRecommendation).realData!.hotels!.length > 0) ||
                  ((trip as EnhancedTripRecommendation).hotels && (trip as EnhancedTripRecommendation).hotels!.length > 0) ? (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Hotel</Label>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {((trip as EnhancedTripRecommendation).realData?.hotels || (trip as EnhancedTripRecommendation).hotels || []).map((hotel) => (
                        <Card
                          key={hotel.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedHotel?.id === hotel.id
                              ? 'border-emerald-500 bg-emerald-50 shadow-md'
                              : 'border-gray-200 hover:border-emerald-300'
                            }`}
                          onClick={() => setSelectedHotel(hotel)}
                        >
                          <CardContent className="p-4">
                            {/* Selected indicator */}
                            {selectedHotel?.id === hotel.id && (
                              <div className="flex items-center gap-1 mb-2 text-emerald-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium">Selected</span>
                              </div>
                            )}

                            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{hotel.name}</h4>
                            {'address' in hotel && hotel.address && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{hotel.address}</p>}
                            {('description' in hotel && hotel.description) && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{hotel.description}</p>}

                            <div className="flex items-end justify-between mb-2">
                              <div>
                                <p className="text-xs text-gray-500">From</p>
                                <p className="text-lg font-bold text-emerald-600">
                                  {formatCurrency(('minPrice' in hotel && hotel.minPrice) ? hotel.minPrice : ('pricePerNight' in hotel ? hotel.pricePerNight : 100))}
                                  <span className="text-xs text-gray-500 font-normal">/night</span>
                                </p>
                              </div>
                              {(hotel.rating || ('rating' in hotel && hotel.rating)) && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-700">{'rating' in hotel ? hotel.rating : hotel.rating}</span>
                                </div>
                              )}
                            </div>

                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                    {amenity}
                                  </span>
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                    +{hotel.amenities.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                                {(() => {
                                  const hotelSource = (trip as EnhancedTripRecommendation).hotelDataSource
                                  if (hotelSource === 'api') return 'Live from Amadeus'
                                  if (hotelSource === 'mock') return 'Sample Data'
                                  return 'Generated Options'
                                })()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Trip Cost Breakdown - Moved here for better visibility */}
          <div>
            <Card className="border-gray-200 bg-gradient-to-r from-sky-50 to-emerald-50 overflow-hidden">
              <button
                onClick={() => setIsCostExpanded(!isCostExpanded)}
                className="w-full hover:bg-emerald-100/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {costBreakdown ? 'Calculated Trip Cost' : 'Estimated Cost'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {costBreakdown
                            ? `For ${adults + children + infants} traveler${adults + children + infants !== 1 ? 's' : ''}`
                            : 'Per person'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {costBreakdown ? formatCurrency(costBreakdown.totalCost) : formatCurrency(trip.estimatedCost)}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          {costBreakdown
                            ? `${formatCurrency(costBreakdown.perPersonCost)} per person`
                            : 'estimated'
                          }
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${isCostExpanded ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </button>

              {isCostExpanded && (
                <div className="border-t border-emerald-200/50">
                  <CardContent className="p-6">
                    {costBreakdown ? (
                      <>
                        {/* Detailed Cost Breakdown */}
                        <div className="space-y-4">
                          {/* Flights */}
                          <div className="flex items-center justify-between pb-3 border-b border-sky-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Flights</p>
                                <p className="text-xs text-gray-600">{costBreakdown.flights.details}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatCurrency(costBreakdown.flights.total)}</p>
                              <p className="text-xs text-gray-600">{formatCurrency(costBreakdown.flights.perPerson)}/person</p>
                            </div>
                          </div>

                          {/* Accommodation */}
                          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Accommodation</p>
                                <p className="text-xs text-gray-600">{costBreakdown.accommodation.details}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatCurrency(costBreakdown.accommodation.total)}</p>
                              <p className="text-xs text-gray-600">{formatCurrency(costBreakdown.accommodation.perNight)}/night</p>
                            </div>
                          </div>

                          {/* Activities */}
                          <div className="flex items-center justify-between pb-3 border-b border-purple-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Activities</p>
                                <p className="text-xs text-gray-600">{costBreakdown.activities.details}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatCurrency(costBreakdown.activities.total)}</p>
                              <p className="text-xs text-gray-600">{formatCurrency(costBreakdown.activities.perPerson)}/person</p>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="flex items-center justify-between pt-3">
                            <div>
                              <p className="text-lg font-medium text-gray-900">Total Trip Cost</p>
                              <p className="text-sm text-gray-600">
                                For {adults + children + infants} traveler{adults + children + infants !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-gray-900">{formatCurrency(costBreakdown.totalCost)}</p>
                              <p className="text-sm font-semibold text-gray-700">
                                {formatCurrency(costBreakdown.perPersonCost)} per person
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                          * Calculated based on your selected flights, hotel, and activities. Prices may vary based on actual booking.
                        </p>
                      </>
                    ) : (
                      <>
                        {/* Original static estimate */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Total Estimated Cost</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(trip.estimatedCost)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Per person</p>
                            <p className="text-lg font-semibold text-gray-700">{formatCurrency(trip.estimatedCost)}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                          * Prices are estimates. Configure your trip above for accurate pricing.
                        </p>
                      </>
                    )}
                  </CardContent>
                </div>
              )}
            </Card>
          </div>

          {/* Activities */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Activities</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid gap-2 md:grid-cols-2">
                {trip.activityDetails && trip.activityDetails.length > 0 ? (
                  // Display rich activity details with descriptions when available
                  trip.activityDetails.map((activity, index) => (
                    <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors ${index < trip.activityDetails!.length - 1 ? '' : ''
                      }`}>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{activity.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                            <span>{activity.duration}h</span>
                            <span className="text-gray-300">•</span>
                            <span>${activity.cost}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${activity.type === 'cultural' ? 'bg-purple-100 text-purple-700' :
                              activity.type === 'adventure' ? 'bg-green-100 text-green-700' :
                                activity.type === 'dining' ? 'bg-orange-100 text-orange-700' :
                                  activity.type === 'relaxation' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                            }`}>
                            {activity.type}
                          </span>
                          {activity.location && (
                            <span className="text-xs text-gray-500">📍 {activity.location}</span>
                          )}
                        </div>
                        {activity.description && activity.description.trim() && (
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">{activity.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to simple activity names when no rich details available
                  trip.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"></div>
                      <span className="text-sm text-gray-700">{activity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Trip Quick Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Best Season</span>
                </div>
                <p className="text-base font-semibold text-gray-900 capitalize">{trip.season}</p>
              </div>

              <div className="text-center border-x border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Family Friendly</span>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {trip.kidFriendly ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Duration</span>
                </div>
                <p className="text-base font-semibold text-gray-900">{trip.duration} days</p>
              </div>
            </div>
          </div>

          {/* Real API Data Sections */}
          {(trip as EnhancedTripRecommendation).realData && (
            <>
              {/* Data Source Indicator */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Sources</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {(trip as EnhancedTripRecommendation).apiSources.countryData && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-blue-700">REST Countries API</span>
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {(trip as EnhancedTripRecommendation).apiSources.weatherData && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm font-medium text-orange-700">OpenWeatherMap API</span>
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {(trip as EnhancedTripRecommendation).apiSources.attractionsData && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium text-purple-700">Geoapify Places API</span>
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Weather Section */}
              {(trip as EnhancedTripRecommendation).realData?.weather && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Current Weather</h3>
                  <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-4xl font-bold text-gray-900">
                              {(trip as EnhancedTripRecommendation).realData!.weather!.current.temp}°F
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {(trip as EnhancedTripRecommendation).realData!.weather!.current.weather.description}
                            </p>
                          </div>
                          <div className="text-left">
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="font-medium">Feels like:</span> {(trip as EnhancedTripRecommendation).realData!.weather!.current.feels_like}°F</p>
                              <p><span className="font-medium">Humidity:</span> {(trip as EnhancedTripRecommendation).realData!.weather!.current.humidity}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                          Live from OpenWeatherMap
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Country Information Section */}
              {(trip as EnhancedTripRecommendation).realData?.countryInfo && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Country Information</h3>
                  <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Capital</p>
                          <p className="font-semibold text-gray-900">{(trip as EnhancedTripRecommendation).realData!.countryInfo.capital}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Region</p>
                          <p className="font-semibold text-gray-900">{(trip as EnhancedTripRecommendation).realData!.countryInfo.region}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Currency</p>
                          <p className="font-semibold text-gray-900">{(trip as EnhancedTripRecommendation).realData!.countryInfo.currency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Languages</p>
                          <p className="font-semibold text-gray-900">{(trip as EnhancedTripRecommendation).realData!.countryInfo.languages.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Timezone</p>
                          <p className="font-semibold text-gray-900">{(trip as EnhancedTripRecommendation).realData!.countryInfo.timezone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image 
                            src={(trip as EnhancedTripRecommendation).realData!.countryInfo.flag} 
                            alt="Flag" 
                            width={32}
                            height={24}
                            className="object-cover rounded" 
                          />
                          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                            Live from REST Countries
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Real Tourist Attractions Section */}
              {(trip as EnhancedTripRecommendation).realData?.attractions && (trip as EnhancedTripRecommendation).realData!.attractions!.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Real Tourist Attractions ({(trip as EnhancedTripRecommendation).realData!.attractions!.length} found)
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {(trip as EnhancedTripRecommendation).realData!.attractions!.slice(0, 6).map((attraction) => (
                      <Card key={attraction.id} className="border-purple-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{attraction.name}</h4>
                            <div className="flex items-center gap-1 ml-2">
                              {[...Array(attraction.rating)].map((_, i) => (
                                <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>

                          {attraction.address && (
                            <p className="text-xs text-gray-500 mb-2">{attraction.address}</p>
                          )}

                          <div className="flex flex-wrap gap-1 mb-2">
                            {attraction.categories.slice(0, 2).map((category, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium">
                                {category}
                              </span>
                            ))}
                          </div>

                          {attraction.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">{attraction.description}</p>
                          )}

                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                              Live from Geoapify
                            </div>
                            {attraction.website && (
                              <a href={attraction.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800">
                                Visit website →
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {(trip as EnhancedTripRecommendation).realData!.attractions!.length > 6 && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      And {(trip as EnhancedTripRecommendation).realData!.attractions!.length - 6} more attractions...
                    </p>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        <DialogFooter className="p-8 pt-2 mt-8">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant={isSaved ? "secondary" : "default"}
            onClick={handleSave}
            className="min-w-[120px] bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white"
          >
            {isSaved ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save Trip
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}