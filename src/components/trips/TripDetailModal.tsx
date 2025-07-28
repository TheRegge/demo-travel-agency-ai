/**
 * Trip Detail Modal Component
 * Displays detailed trip information in a modal dialog using shadcn/ui Dialog
 */

import { TripDetailModalProps } from '@/types/conversation'
import { EnhancedTripRecommendation } from '@/types/travel'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getDestinationGradient } from '@/services/photoService'

export const TripDetailModal = ({
  trip,
  isOpen,
  onClose,
  onSave,
  isSaved = false
}: TripDetailModalProps) => {

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

  // Extract photo data if available
  const photoData = (trip as any).photoData

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-6xl w-[95vw] sm:!max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-0">
        {/* Hidden Dialog Title for Accessibility */}
        <DialogTitle className="sr-only">{trip.destination} Trip Details</DialogTitle>
        
        {/* Destination Photo Header */}
        <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
          {photoData?.imageUrl ? (
            <>
              <img
                src={photoData.imageUrl}
                alt={photoData.altText}
                className="w-full h-full object-cover"
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

          {/* Activities */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Activities</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {trip.activityDetails && trip.activityDetails.length > 0 ? (
                // Display rich activity details with descriptions when available
                trip.activityDetails.map((activity, index) => (
                  <Card key={activity.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 mt-2"></div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{activity.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                                activity.type === 'cultural' ? 'bg-purple-100 text-purple-700' :
                                activity.type === 'adventure' ? 'bg-green-100 text-green-700' :
                                activity.type === 'dining' ? 'bg-orange-100 text-orange-700' :
                                activity.type === 'relaxation' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {activity.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {activity.duration}h • ${activity.cost}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {activity.description && activity.description.trim() && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{activity.description}</p>
                      )}
                      
                      {activity.location && (
                        <p className="text-xs text-gray-500 mt-2">📍 {activity.location}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Fallback to simple activity names when no rich details available
                trip.activities.map((activity, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"></div>
                        <span className="text-gray-700">{activity}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Best Season</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                  <span className="text-gray-700 capitalize">{trip.season}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Family Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {trip.kidFriendly ? (
                    <>
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Yes</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">Not specified</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{trip.duration} days</span>
                </div>
              </CardContent>
            </Card>
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
                          <img src={(trip as EnhancedTripRecommendation).realData!.countryInfo.flag} alt="Flag" className="w-8 h-6 object-cover rounded" />
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
                    {(trip as EnhancedTripRecommendation).realData!.attractions!.slice(0, 6).map((attraction, index) => (
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

          {/* Budget Breakdown */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Estimated Cost</h3>
            <Card className="border-gray-200 bg-gradient-to-r from-sky-50 to-emerald-50">
              <CardContent className="p-6">
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
                  * Prices are estimates and may vary based on season, availability, and booking timing.
                </p>
              </CardContent>
            </Card>
          </div>
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