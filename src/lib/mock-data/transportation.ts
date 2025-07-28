/**
 * Transportation Database
 * Mock realistic transportation options between popular destinations
 */

import { TransportationOption, TransportationAlternative, TransportMethod } from "@/types/travel"

// Transportation routes between popular destinations
export interface TransportRoute {
  from: string
  to: string
  primary: TransportationOption
  alternatives: TransportationAlternative[]
  region: string // "europe", "asia", "north_america", etc.
}

export const transportationDatabase: TransportRoute[] = [
  // European Routes
  {
    from: "paris-france",
    to: "rome-italy", 
    region: "europe",
    primary: {
      method: "train",
      duration: "11h 15min",
      cost: 165,
      description: "High-speed train via Lyon and Turin with stunning Alpine views",
      bookingInfo: "Book 2-3 weeks ahead for best prices. Eurail Pass valid."
    },
    alternatives: [
      {
        method: "flight",
        duration: "2h 30min",
        cost: 89,
        description: "Direct flight from CDG to Fiumicino",
        pros: ["Fastest option", "Multiple daily flights"],
        cons: ["Airport time", "Baggage restrictions"]
      },
      {
        method: "bus",
        duration: "19h 45min",
        cost: 45,
        description: "Overnight bus via Switzerland",
        pros: ["Budget-friendly", "Overnight saves accommodation"],
        cons: ["Long journey", "Limited comfort"]
      }
    ]
  },
  {
    from: "rome-italy",
    to: "barcelona-spain",
    region: "europe", 
    primary: {
      method: "flight",
      duration: "2h 10min",
      cost: 78,
      description: "Direct flight from Fiumicino to El Prat",
      bookingInfo: "Book 3-4 weeks ahead. Vueling and Ryanair offer good deals."
    },
    alternatives: [
      {
        method: "train",
        duration: "13h 30min",
        cost: 140,
        description: "High-speed train via Nice and Montpellier",
        pros: ["Scenic Mediterranean route", "No baggage limits"],
        cons: ["Longer travel time", "Requires transfer"]
      },
      {
        method: "ferry",
        duration: "20h overnight",
        cost: 95,
        description: "Overnight ferry from Civitavecchia to Barcelona",
        pros: ["Unique experience", "Cabin included"],
        cons: ["Weather dependent", "Limited frequency"]
      }
    ]
  },
  {
    from: "barcelona-spain",
    to: "paris-france",
    region: "europe",
    primary: {
      method: "train",
      duration: "6h 30min",
      cost: 120,
      description: "High-speed TGV through beautiful French countryside",
      bookingInfo: "SNCF Connect for bookings. Eurail Pass valid."
    },
    alternatives: [
      {
        method: "flight",
        duration: "1h 45min",
        cost: 85,
        description: "Direct flight from El Prat to CDG",
        pros: ["Fastest option", "Frequent departures"],
        cons: ["Airport transfers", "Environmental impact"]
      }
    ]
  },

  // Asian Routes
  {
    from: "tokyo-japan",
    to: "bangkok-thailand",
    region: "asia",
    primary: {
      method: "flight",
      duration: "7h 15min",
      cost: 320,
      description: "Direct flight from Narita to Suvarnabhumi",
      bookingInfo: "JAL and Thai Airways offer best service. Book 4-6 weeks ahead."
    },
    alternatives: [
      {
        method: "flight",
        duration: "9h 30min",
        cost: 240,
        description: "Flight with stopover in Seoul or Kuala Lumpur",
        pros: ["Budget option", "Explore stopover city"],
        cons: ["Longer travel time", "Connection risk"]
      }
    ]
  },
  {
    from: "bangkok-thailand",
    to: "siem-reap-cambodia",
    region: "asia",
    primary: {
      method: "bus",
      duration: "8h 30min",
      cost: 25,
      description: "Comfortable bus via border crossing at Poipet",
      bookingInfo: "Giant Ibis or Mekong Express recommended. Visa on arrival for most."
    },
    alternatives: [
      {
        method: "flight",
        duration: "1h 20min",
        cost: 95,
        description: "Direct flight to Siem Reap Airport",
        pros: ["Time-saving", "Comfortable"],
        cons: ["Higher cost", "Airport formalities"]
      }
    ]
  },

  // US Routes
  {
    from: "new-york-ny",
    to: "washington-dc",
    region: "north_america",
    primary: {
      method: "train",
      duration: "3h 30min",
      cost: 75,
      description: "Amtrak Acela Express - premium high-speed service",
      bookingInfo: "Book on Amtrak.com. Business class worth the upgrade."
    },
    alternatives: [
      {
        method: "bus",
        duration: "4h 45min",
        cost: 25,
        description: "Megabus or FlixBus with WiFi",
        pros: ["Budget-friendly", "Frequent departures"],
        cons: ["Traffic delays", "Less comfortable"]
      },
      {
        method: "flight",
        duration: "1h 30min",
        cost: 125,
        description: "Shuttle flights from LGA to DCA",
        pros: ["Fastest option"],
        cons: ["Airport time", "Weather delays common"]
      },
      {
        method: "car_rental",
        duration: "4h 30min",
        cost: 85,
        description: "I-95 South - scenic route with flexibility",
        pros: ["Complete flexibility", "Stop anywhere"],
        cons: ["Traffic", "Parking costs in DC"]
      }
    ]
  },
  {
    from: "washington-dc",
    to: "miami-fl",
    region: "north_america",
    primary: {
      method: "flight",
      duration: "2h 45min",
      cost: 185,
      description: "Direct flight from DCA to MIA",
      bookingInfo: "American and United offer most flights. Book 2-3 weeks ahead."
    },
    alternatives: [
      {
        method: "train",
        duration: "23h 15min",
        cost: 125,
        description: "Amtrak Silver Star - overnight journey through the South",
        pros: ["Scenic route", "Sleeper options", "No airport hassles"],
        cons: ["Very long journey", "Limited food options"]
      },
      {
        method: "car_rental",
        duration: "12h 30min",
        cost: 220,
        description: "I-95 South through Virginia, Carolinas, Georgia, Florida",
        pros: ["See multiple states", "Complete freedom"],
        cons: ["Long drive", "Tolls", "Fuel costs"]
      }
    ]
  },

  // Additional European Routes for Food Tours
  {
    from: "lyon-france",
    to: "bologna-italy",
    region: "europe",
    primary: {
      method: "train",
      duration: "8h 45min",
      cost: 95,
      description: "Train through Swiss Alps - one of Europe's most scenic routes",
      bookingInfo: "Swiss Travel Pass covers part of route. Reserve seats for scenic views."
    },
    alternatives: [
      {
        method: "flight",
        duration: "1h 30min",
        cost: 110,
        description: "Flight to Milan + train to Bologna",
        pros: ["Faster overall", "Reliable"],
        cons: ["Airport transfers", "Connection needed"]
      }
    ]
  },
  {
    from: "bologna-italy", 
    to: "san-sebastian-spain",
    region: "europe",
    primary: {
      method: "train",
      duration: "12h 15min",
      cost: 135,
      description: "High-speed train via Milan and French Basque country",
      bookingInfo: "Requires 2-3 transfers. Beautiful coastal views in final segment."
    },
    alternatives: [
      {
        method: "flight",
        duration: "5h 30min",
        cost: 165,
        description: "Flight to Bilbao + bus to San Sebastian",
        pros: ["Faster option", "Explore Bilbao"],
        cons: ["Multiple transfers", "Higher cost"]
      }
    ]
  },

  // Budget European Routes
  {
    from: "berlin-germany",
    to: "prague-czech-republic", 
    region: "europe",
    primary: {
      method: "bus",
      duration: "4h 30min",
      cost: 35,
      description: "FlixBus through scenic Saxon countryside",
      bookingInfo: "Very frequent departures. Book online for discounts."
    },
    alternatives: [
      {
        method: "train",
        duration: "4h 15min",
        cost: 65,
        description: "Deutsche Bahn + Czech Railways connection",
        pros: ["More comfortable", "Reliable timing"],
        cons: ["Higher cost", "Requires transfer"]
      },
      {
        method: "car_rental",
        duration: "3h 45min",
        cost: 55,
        description: "Autobahn A6 through Dresden",
        pros: ["Fastest option", "See Dresden en route"],
        cons: ["Driving in foreign country", "Parking costs"]
      }
    ]
  },
  {
    from: "prague-czech-republic",
    to: "budapest-hungary",
    region: "europe",
    primary: {
      method: "train",
      duration: "7h 15min",
      cost: 45,
      description: "Comfortable train through beautiful Bohemian countryside",
      bookingInfo: "RegioJet offers good service with snacks included."
    },
    alternatives: [
      {
        method: "bus",
        duration: "7h 45min",
        cost: 25,
        description: "Budget bus option with WiFi",
        pros: ["Very affordable", "Direct route"],
        cons: ["Less comfortable", "Limited luggage space"]
      }
    ]
  },
  {
    from: "budapest-hungary",
    to: "vienna-austria",
    region: "europe",
    primary: {
      method: "train",
      duration: "2h 30min",
      cost: 35,
      description: "Frequent trains through beautiful Danube valley",
      bookingInfo: "ÖBB Railjet - modern, comfortable trains every 2 hours."
    },
    alternatives: [
      {
        method: "bus",
        duration: "3h 15min",
        cost: 20,
        description: "FlixBus direct service",
        pros: ["Budget option", "Free WiFi"],
        cons: ["Slower", "Less frequent"]
      }
    ]
  }
]

/**
 * Find transportation options between two destinations
 */
export function getTransportationOptions(fromDestinationId: string, toDestinationId: string): TransportRoute | null {
  return transportationDatabase.find(route => 
    route.from === fromDestinationId && route.to === toDestinationId
  ) || null
}

/**
 * Get all possible destinations from a starting point
 */
export function getDestinationsFrom(fromDestinationId: string): string[] {
  return transportationDatabase
    .filter(route => route.from === fromDestinationId)
    .map(route => route.to)
}

/**
 * Get regional transport networks (for suggesting multi-destination trips)
 */
export function getRegionalDestinations(region: string): string[] {
  const destinations = new Set<string>()
  
  transportationDatabase
    .filter(route => route.region === region)
    .forEach(route => {
      destinations.add(route.from)
      destinations.add(route.to)
    })
  
  return Array.from(destinations)
}

/**
 * Calculate total transport cost for a multi-destination trip
 */
export function calculateTripTransportCost(destinationIds: string[]): {
  totalCost: number
  routes: TransportRoute[]
  summary: string
} {
  let totalCost = 0
  const routes: TransportRoute[] = []
  const methods: string[] = []
  
  for (let i = 0; i < destinationIds.length - 1; i++) {
    const from = destinationIds[i]
    const to = destinationIds[i + 1]
    if (!from || !to) continue
    
    const route = getTransportationOptions(from, to)
    if (route) {
      routes.push(route)
      totalCost += route.primary.cost
      methods.push(route.primary.method)
    }
  }
  
  // Generate summary
  const methodCounts = methods.reduce((acc, method) => {
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const summary = Object.entries(methodCounts)
    .map(([method, count]) => count > 1 ? `${method}s` : method)
    .join(", ")
  
  return {
    totalCost,
    routes,
    summary: `Mix of ${summary}`
  }
}

/**
 * Get transport method icon for UI display
 */
export function getTransportIcon(method: TransportMethod): string {
  const icons = {
    flight: "✈️",
    train: "🚄", 
    bus: "🚌",
    car_rental: "🚗",
    ferry: "⛴️",
    rideshare: "🚙",
    private_transfer: "🚐"
  }
  return icons[method] || "🚗"
}

/**
 * Get transport method display name
 */
export function getTransportDisplayName(method: TransportMethod): string {
  const names = {
    flight: "Flight",
    train: "Train",
    bus: "Bus", 
    car_rental: "Car Rental",
    ferry: "Ferry",
    rideshare: "Rideshare",
    private_transfer: "Private Transfer"
  }
  return names[method] || "Transport"
}