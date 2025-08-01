export { mockDestinations } from './destinations'
export { fallbackTripDatabase } from './fallback-trips'

// Helper functions for working with mock data
import { mockDestinations } from './destinations'
import { fallbackTripDatabase } from './fallback-trips'
import { MockDestination, TripRecommendation } from '@/types/travel'

/**
 * Get destinations by category
 */
export function getDestinationsByCategory(category: MockDestination['category']): MockDestination[] {
  return mockDestinations.filter((dest: MockDestination) => dest.category === category)
}

/**
 * Get destinations by kid-friendly score
 */
export function getKidFriendlyDestinations(minScore: number = 7.0): MockDestination[] {
  return mockDestinations.filter((dest: MockDestination) => dest.kidFriendlyScore >= minScore)
}

/**
 * Get destinations within budget range
 */
export function getDestinationsInBudget(maxBudget: number, season: 'peak' | 'shoulder' | 'offSeason' = 'shoulder'): MockDestination[] {
  return mockDestinations.filter((dest: MockDestination) => dest.seasonalPricing[season] <= maxBudget)
}

/**
 * Get fallback recommendations based on budget
 */
export function getFallbackRecommendations(budget: number): {
  tier: 'ultraBudget' | 'lowBudget' | 'moderateBudget',
  recommendations: unknown[]
} {
  if (budget <= 200) {
    return {
      tier: 'ultraBudget',
      recommendations: [
        ...fallbackTripDatabase.ultraBudget.localDayTrips.slice(0, 3),
        ...fallbackTripDatabase.ultraBudget.freeActivities.slice(0, 2)
      ]
    }
  } else if (budget <= 800) {
    return {
      tier: 'lowBudget', 
      recommendations: [
        ...fallbackTripDatabase.lowBudget.weekendGetaways.slice(0, 2),
        ...fallbackTripDatabase.lowBudget.campingOptions.slice(0, 2)
      ]
    }
  } else {
    return {
      tier: 'moderateBudget',
      recommendations: [
        ...fallbackTripDatabase.moderateBudget.fullTrips.slice(0, 1),
        ...fallbackTripDatabase.moderateBudget.standardOptions.slice(0, 2)
      ]
    }
  }
}

/**
 * Convert mock destination to trip recommendation format
 */
export function convertToTripRecommendation(
  destination: MockDestination, 
  duration: number = 3,
  season: 'peak' | 'shoulder' | 'offSeason' = 'shoulder'
): TripRecommendation {
  const baseCost = destination.seasonalPricing[season]
  const flightCost = destination.flightData.averageCost
  const totalCost = baseCost + flightCost
  
  return {
    tripId: destination.id,
    destination: destination.name,
    duration,
    estimatedCost: totalCost,
    highlights: destination.activities.slice(0, 3).map(activity => activity.name),
    description: destination.description,
    activities: destination.activities.slice(0, 5).map(activity => activity.name),
    season: season,
    kidFriendly: destination.kidFriendlyScore >= 7,
    customizations: {
      hotelType: totalCost > 4000 ? 'luxury' : totalCost > 2000 ? 'standard' : 'budget',
      activities: destination.activities.slice(0, 2).map(activity => activity.name)
    },
    score: Math.round(destination.kidFriendlyScore * 10), // Convert to 0-100 scale
    type: "single" // Add the required type field
  }
}

/**
 * Generate mock trip recommendations based on criteria
 */
export function generateMockRecommendations(criteria: {
  budget?: number
  duration?: number
  kidFriendly?: boolean
  category?: MockDestination['category']
  season?: 'peak' | 'shoulder' | 'offSeason'
}): TripRecommendation[] {
  const {
    budget = 3000,
    duration = 3,
    kidFriendly = false,
    category,
    season = 'shoulder'
  } = criteria

  let filteredDestinations = mockDestinations

  // Filter by budget
  filteredDestinations = filteredDestinations.filter((dest: MockDestination) => 
    dest.seasonalPricing[season] + dest.flightData.averageCost <= budget
  )

  // Filter by category if specified
  if (category) {
    filteredDestinations = filteredDestinations.filter((dest: MockDestination) => dest.category === category)
  }

  // Filter by kid-friendly if requested
  if (kidFriendly) {
    filteredDestinations = filteredDestinations.filter((dest: MockDestination) => dest.kidFriendlyScore >= 7.0)
  }

  // Sort by kid-friendly score and take top 3
  const topDestinations = filteredDestinations
    .sort((a: MockDestination, b: MockDestination) => b.kidFriendlyScore - a.kidFriendlyScore)
    .slice(0, 3)

  return topDestinations.map((dest: MockDestination) => convertToTripRecommendation(dest, duration, season))
}