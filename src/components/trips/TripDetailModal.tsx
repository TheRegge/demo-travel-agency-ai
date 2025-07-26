/**
 * Trip Detail Modal Component
 * Displays detailed trip information in a modal dialog using shadcn/ui Dialog
 */

import { TripDetailModalProps } from '@/types/conversation'
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

export const TripDetailModal = ({
  trip,
  isOpen,
  onClose,
  onSave,
  isSaved = false
}: TripDetailModalProps) => {

  if (!trip) return null

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
            {trip.destination}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            {trip.duration} days • {formatCurrency(trip.estimatedCost)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
              {trip.activities.map((activity, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"></div>
                      <span className="text-gray-700">{activity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

          {/* Budget Breakdown Placeholder */}
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

        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant={isSaved ? "secondary" : "tropical"} 
            onClick={handleSave}
            className="min-w-[120px]"
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