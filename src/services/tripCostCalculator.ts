/**
 * Trip Cost Calculator Service
 * Provides accurate cost calculations based on real flight/hotel data and user inputs
 */

export interface TripCostBreakdown {
  flights: {
    total: number
    perPerson: number
    details: string
  }
  accommodation: {
    total: number
    perNight: number
    totalNights: number
    details: string
  }
  activities: {
    total: number
    perPerson: number
    details: string
  }
  totalCost: number
  perPersonCost: number
  currency: string
}

export interface TravelersConfig {
  adults: number
  children: number
  infants: number
}

export interface TripConfig {
  travelers: TravelersConfig
  checkInDate: Date
  checkOutDate: Date
  selectedHotel?: {
    id: string
    name: string
    minPrice: number
    currency: string
  }
  selectedFlights?: {
    outbound?: {
      id: string
      price: number
      airline: string
    }
    return?: {
      id: string
      price: number
      airline: string
    }
  }
}

class TripCostCalculator {
  /**
   * Calculate total number of travelers
   */
  getTotalTravelers(travelers: TravelersConfig): number {
    return travelers.adults + travelers.children + travelers.infants
  }

  /**
   * Calculate number of hotel rooms needed based on travelers
   * Assumes max 2 adults per room, children can share with adults
   */
  calculateRoomsNeeded(travelers: TravelersConfig): number {
    const { adults, children } = travelers
    // Basic calculation: 2 people per room
    const totalPeople = adults + children
    return Math.ceil(totalPeople / 2)
  }

  /**
   * Calculate number of nights between check-in and check-out
   */
  calculateNights(checkIn: Date, checkOut: Date): number {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  /**
   * Calculate flight costs for all travelers
   */
  calculateFlightCost(
    flights: { price: number }[],
    travelers: TravelersConfig
  ): { total: number; perPerson: number } {
    const flightPrice = flights.reduce((sum, flight) => sum + flight.price, 0)
    
    // Typically: Adults pay full price, children 75%, infants 10% (lap infant)
    const adultCost = flightPrice * travelers.adults
    const childCost = flightPrice * 0.75 * travelers.children
    const infantCost = flightPrice * 0.1 * travelers.infants
    
    const total = adultCost + childCost + infantCost
    const totalTravelers = this.getTotalTravelers(travelers)
    
    return {
      total: Math.round(total),
      perPerson: totalTravelers > 0 ? Math.round(total / totalTravelers) : 0
    }
  }

  /**
   * Calculate hotel costs based on rooms and nights
   */
  calculateHotelCost(
    hotelPricePerNight: number,
    nights: number,
    rooms: number
  ): { total: number; perNight: number; totalNights: number } {
    const perNight = hotelPricePerNight * rooms
    const total = perNight * nights
    
    return {
      total: Math.round(total),
      perNight: Math.round(perNight),
      totalNights: nights
    }
  }

  /**
   * Calculate activity costs for all travelers
   * Assumes children get 50% discount, infants are free
   */
  calculateActivityCost(
    activities: { cost: number }[],
    travelers: TravelersConfig
  ): { total: number; perPerson: number } {
    const baseCost = activities.reduce((sum, activity) => sum + activity.cost, 0)
    
    const adultCost = baseCost * travelers.adults
    const childCost = baseCost * 0.5 * travelers.children
    // Infants typically free for activities
    
    const total = adultCost + childCost
    const totalPayingTravelers = travelers.adults + travelers.children
    
    return {
      total: Math.round(total),
      perPerson: totalPayingTravelers > 0 ? Math.round(total / totalPayingTravelers) : 0
    }
  }

  /**
   * Calculate complete trip cost breakdown
   */
  calculateTripCost(
    config: TripConfig,
    activities: { cost: number }[] = []
  ): TripCostBreakdown {
    const { travelers, checkInDate, checkOutDate, selectedHotel, selectedFlights } = config
    
    // Calculate nights
    const nights = this.calculateNights(checkInDate, checkOutDate)
    const rooms = this.calculateRoomsNeeded(travelers)
    const totalTravelers = this.getTotalTravelers(travelers)
    
    // Calculate flight costs
    const flightsList = []
    if (selectedFlights?.outbound) flightsList.push(selectedFlights.outbound)
    if (selectedFlights?.return) flightsList.push(selectedFlights.return)
    
    const flightCosts = flightsList.length > 0
      ? this.calculateFlightCost(flightsList, travelers)
      : { total: 0, perPerson: 0 }
    
    // Calculate hotel costs
    const hotelPrice = selectedHotel?.minPrice || 150 // Default price if no hotel selected
    const hotelCosts = this.calculateHotelCost(hotelPrice, nights, rooms)
    
    // Calculate activity costs
    const activityCosts = this.calculateActivityCost(activities, travelers)
    
    // Calculate totals
    const totalCost = flightCosts.total + hotelCosts.total + activityCosts.total
    const perPersonCost = totalTravelers > 0 ? Math.round(totalCost / totalTravelers) : 0
    
    return {
      flights: {
        total: flightCosts.total,
        perPerson: flightCosts.perPerson,
        details: flightsList.length > 0 
          ? `${flightsList.length} flight${flightsList.length > 1 ? 's' : ''} for ${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''}`
          : 'No flights selected'
      },
      accommodation: {
        total: hotelCosts.total,
        perNight: hotelCosts.perNight,
        totalNights: hotelCosts.totalNights,
        details: selectedHotel 
          ? `${selectedHotel.name} - ${rooms} room${rooms > 1 ? 's' : ''} × ${nights} night${nights > 1 ? 's' : ''}`
          : `${rooms} room${rooms > 1 ? 's' : ''} × ${nights} night${nights > 1 ? 's' : ''}`
      },
      activities: {
        total: activityCosts.total,
        perPerson: activityCosts.perPerson,
        details: activities.length > 0
          ? `${activities.length} activities for ${travelers.adults + travelers.children} participant${(travelers.adults + travelers.children) > 1 ? 's' : ''}`
          : 'No activities included'
      },
      totalCost,
      perPersonCost,
      currency: selectedHotel?.currency || 'USD'
    }
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
}

export const tripCostCalculator = new TripCostCalculator()