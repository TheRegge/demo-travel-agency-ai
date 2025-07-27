/**
 * Lazy-loaded Featured Destinations Grid
 * Only loads when it comes into viewport on homepage
 */

import { lazy } from 'react'

export const LazyFeaturedDestinationsGrid = lazy(() => 
  import('@/components/layout/FeaturedDestinationsGrid').then(module => ({
    default: module.FeaturedDestinationsGrid
  }))
)