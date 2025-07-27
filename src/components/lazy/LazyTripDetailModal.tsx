/**
 * Lazy-loaded Trip Detail Modal
 * Only loads when user clicks on a trip card
 */

import { lazy } from 'react'

export const LazyTripDetailModal = lazy(() => 
  import('@/components/trips/TripDetailModal').then(module => ({
    default: module.TripDetailModal
  }))
)