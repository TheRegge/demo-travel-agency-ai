/**
 * Multi-Destination Trip Database
 * Sample complex itineraries for testing the multi-destination system
 */

import { TripRecommendation } from "@/types/travel"

// European Food & Culture Tour
export const europeanFoodTour: TripRecommendation = {
  tripId: "europe-food-tour-2024",
  destination: "European Culinary Circuit",
  duration: 14,
  estimatedCost: 4800,
  highlights: [
    "Michelin-starred dining in Lyon",
    "Pasta making in Bologna", 
    "Pintxos crawl in San Sebastian",
    "High-speed trains between cities"
  ],
  description: "A gastronomic journey through Europe's finest culinary capitals, featuring hands-on cooking classes, market tours, and dining at renowned restaurants.",
  activities: [
    "French cooking class with professional chef",
    "Bologna food market walking tour",
    "San Sebastian pintxos and wine pairing",
    "Lyon traboule (hidden passage) food tour"
  ],
  season: "spring",
  kidFriendly: false,
  customizations: {
    hotelType: "luxury",
    activities: ["Cooking classes", "Food tours", "Wine tastings"]
  },
  score: 95,
  type: "multi-destination",
  itinerary: {
    legs: [
      {
        legId: "lyon-leg",
        destination: "Lyon, France",
        duration: 4,
        description: "The gastronomic capital of France with traditional bouchons and innovative restaurants.",
        highlights: ["Paul Bocuse Market", "Traboule food tours", "Michelin dining"],
        activities: [
          "Traditional French cooking class",
          "Les Halles de Lyon food market tour", 
          "Old Lyon traboule walking tour",
          "Bouchon restaurant experience"
        ],
        hotels: [
          {
            id: "intercontinental-lyon",
            name: "InterContinental Lyon - Hotel Dieu",
            type: "luxury",
            pricePerNight: 320,
            rating: 4.7,
            amenities: ["Historic Building", "Spa", "Fine Dining", "River Views"],
            kidFriendly: false,
            description: "Luxury hotel in a beautifully restored 18th-century building."
          }
        ],
        estimatedCost: 1400,
        transportToNext: {
          method: "train",
          duration: "8h 45min",
          cost: 95,
          description: "Scenic train through Swiss Alps to Bologna",
          bookingInfo: "Swiss Travel Pass covers part of route. Reserve seats for mountain views."
        }
      },
      {
        legId: "bologna-leg", 
        destination: "Bologna, Italy",
        duration: 5,
        description: "Italy's food capital, famous for ragù, tortellini, and traditional pasta making.",
        highlights: ["Pasta making workshop", "Mercato delle Erbe", "Traditional osteria dining"],
        activities: [
          "Hands-on pasta and ragù cooking class",
          "Mercato delle Erbe market tour",
          "Parmigiano Reggiano factory visit",
          "Traditional osteria food crawl"
        ],
        hotels: [
          {
            id: "grand-hotel-majestic",
            name: "Grand Hotel Majestic",
            type: "luxury", 
            pricePerNight: 280,
            rating: 4.5,
            amenities: ["Historic Palace", "Spa", "Central Location", "Michelin Restaurant"],
            kidFriendly: false,
            description: "Art Nouveau palace hotel in the heart of Bologna."
          }
        ],
        estimatedCost: 1600,
        transportToNext: {
          method: "train",
          duration: "12h 15min", 
          cost: 135,
          description: "High-speed train via Milan and French Basque country",
          bookingInfo: "Requires 2-3 transfers. Beautiful coastal views in final segment."
        }
      },
      {
        legId: "san-sebastian-leg",
        destination: "San Sebastian, Spain", 
        duration: 5,
        description: "Pintxos paradise with the highest concentration of Michelin stars per capita in the world.",
        highlights: ["Pintxos bar crawl", "Cooking class with local chef", "Basque wine tasting"],
        activities: [
          "Traditional Basque cooking class",
          "Parte Vieja pintxos bar crawl",
          "La Rioja wine region day trip",
          "Local market and seafood tour"
        ],
        hotels: [
          {
            id: "hotel-maria-cristina",
            name: "Hotel Maria Cristina",
            type: "luxury",
            pricePerNight: 350,
            rating: 4.8,
            amenities: ["Beachfront", "Spa", "Michelin Restaurant", "Historic Elegance"],
            kidFriendly: false,
            description: "Belle Époque palace hotel overlooking La Concha Bay."
          }
        ],
        estimatedCost: 1800
      }
    ],
    totalDistance: "1,240 miles",
    totalTransportCost: 230,
    transportSummary: "High-speed trains with scenic Alpine and coastal routes"
  }
}

// Southeast Asia Backpacking Adventure
export const asiaBackpackingTour: TripRecommendation = {
  tripId: "asia-backpacking-2024",
  destination: "Southeast Asia Discovery",
  duration: 21,
  estimatedCost: 2400,
  highlights: [
    "Ancient temples of Angkor Wat",
    "Bangkok street food tours",
    "Traditional longtail boat rides",
    "Budget-friendly accommodations"
  ],
  description: "An epic backpacking journey through Southeast Asia's cultural highlights, combining ancient wonders, vibrant cities, and authentic local experiences.",
  activities: [
    "Angkor Wat sunrise tour",
    "Thai cooking class in Bangkok",
    "Floating market boat tour",
    "Temple hopping by bicycle"
  ],
  season: "dry season",
  kidFriendly: true,
  customizations: {
    hotelType: "budget",
    activities: ["Temple visits", "Street food", "Cultural experiences"]
  },
  score: 88,
  type: "multi-destination",
  itinerary: {
    legs: [
      {
        legId: "bangkok-leg",
        destination: "Bangkok, Thailand",
        duration: 7,
        description: "Thailand's vibrant capital with incredible street food, ornate temples, and bustling markets.",
        highlights: ["Chatuchak Weekend Market", "Grand Palace", "Street food tours"],
        activities: [
          "Thai street food cooking class",
          "Grand Palace and Wat Pho temple tour",
          "Floating market day trip",
          "Khao San Road evening exploration"
        ],
        hotels: [
          {
            id: "lub-d-bangkok-silom",
            name: "Lub d Bangkok Silom",
            type: "budget",
            pricePerNight: 45,
            rating: 4.2,
            amenities: ["Modern Hostel", "Social Areas", "24/7 Reception", "Breakfast"],
            kidFriendly: true,
            description: "Stylish hostel with private rooms and social atmosphere."
          }
        ],
        estimatedCost: 800,
        transportToNext: {
          method: "bus",
          duration: "8h 30min",
          cost: 25,
          description: "Comfortable bus via border crossing at Poipet",
          bookingInfo: "Giant Ibis or Mekong Express recommended. Visa on arrival for most."
        }
      },
      {
        legId: "siem-reap-leg",
        destination: "Siem Reap, Cambodia",
        duration: 6,
        description: "Gateway to Angkor Archaeological Park with magnificent temple complexes and rich Khmer culture.",
        highlights: ["Angkor Wat sunrise", "Bayon Temple faces", "Pub Street atmosphere"],
        activities: [
          "Angkor Wat sunrise and full-day temple tour",
          "Bicycle tour through countryside",
          "Traditional Apsara dance performance",
          "Tonle Sap floating village visit"
        ],
        hotels: [
          {
            id: "onederz-siem-reap",
            name: "Onederz Siem Reap",
            type: "budget",
            pricePerNight: 35,
            rating: 4.0,
            amenities: ["Pool", "Restaurant", "Tour Desk", "Free WiFi"],
            kidFriendly: true,
            description: "Clean, comfortable hostel near temple complexes."
          }
        ],
        estimatedCost: 600,
        transportToNext: {
          method: "flight",
          duration: "1h 20min",
          cost: 95,
          description: "Budget flight back to Bangkok for international connections",
          bookingInfo: "AirAsia and Cambodia Airways offer regular flights."
        }
      },
      {
        legId: "bangkok-final-leg",
        destination: "Bangkok, Thailand (Return)",
        duration: 8,
        description: "Extended stay to explore Bangkok's hidden gems, take day trips, and enjoy final Thai experiences.",
        highlights: ["Ayuthaya day trip", "Thai massage course", "Weekend market shopping"],
        activities: [
          "Ayuthaya ancient capital day trip",
          "Traditional Thai massage course",
          "Jim Thompson House museum",
          "Chatuchak Weekend Market shopping"
        ],
        hotels: [
          {
            id: "lub-d-bangkok-silom",
            name: "Lub d Bangkok Silom",
            type: "budget",
            pricePerNight: 45,
            rating: 4.2,
            amenities: ["Modern Hostel", "Social Areas", "24/7 Reception", "Breakfast"],
            kidFriendly: true,
            description: "Return to familiar base for final week."
          }
        ],
        estimatedCost: 880
      }
    ],
    totalDistance: "580 miles",
    totalTransportCost: 120,
    transportSummary: "Mix of budget buses and short flights"
  }
}

// US National Parks Road Trip
export const usNationalParksTrip: TripRecommendation = {
  tripId: "us-national-parks-2024",
  destination: "American Southwest Parks Circuit",
  duration: 12,
  estimatedCost: 3200,
  highlights: [
    "Grand Canyon sunrise viewpoints",
    "Zion National Park hiking",
    "Scenic drives through red rock country",
    "Stargazing in dark sky reserves"
  ],
  description: "Epic American Southwest road trip covering iconic national parks with stunning landscapes, hiking trails, and unforgettable outdoor experiences.",
  activities: [
    "Grand Canyon South Rim hiking",
    "Zion Narrows wading adventure", 
    "Bryce Canyon amphitheater tour",
    "Monument Valley jeep safari"
  ],
  season: "spring",
  kidFriendly: true,
  customizations: {
    hotelType: "standard",
    activities: ["Hiking", "Scenic drives", "Photography", "Stargazing"]
  },
  score: 92,
  type: "multi-destination",
  itinerary: {
    legs: [
      {
        legId: "grand-canyon-leg",
        destination: "Grand Canyon National Park, Arizona",
        duration: 4,
        description: "One of the world's most spectacular natural wonders with breathtaking rim trails and viewpoints.",
        highlights: ["South Rim Trail", "Hermit Road scenic drive", "Desert View Watchtower"],
        activities: [
          "South Rim Trail hiking",
          "Hermit Road scenic sunset drive",
          "Desert View Watchtower visit",
          "Grand Canyon IMAX theater"
        ],
        hotels: [
          {
            id: "grand-canyon-lodge",
            name: "Grand Canyon National Park Lodges",
            type: "standard",
            pricePerNight: 180,
            rating: 4.1,
            amenities: ["In-Park Location", "Restaurant", "Gift Shop", "Canyon Views"],
            kidFriendly: true,
            description: "Historic lodges within the national park."
          }
        ],
        estimatedCost: 900,
        transportToNext: {
          method: "car_rental",
          duration: "4h 30min",
          cost: 85,
          description: "Scenic drive through Arizona high country to Zion",
          bookingInfo: "Highway 89 route offers beautiful desert landscapes."
        }
      },
      {
        legId: "zion-leg",
        destination: "Zion National Park, Utah", 
        duration: 4,
        description: "Dramatic red cliffs and narrow slot canyons perfect for hiking and photography.",
        highlights: ["Angels Landing hike", "Zion Narrows wading", "Emerald Pools trails"],
        activities: [
          "Angels Landing challenging hike",
          "Zion Narrows bottom-up hike",
          "Emerald Pools easy family trails",
          "Canyon Junction Bridge sunset"
        ],
        hotels: [
          {
            id: "cliffrose-lodge",
            name: "Cliffrose Lodge & Gardens",
            type: "standard",
            pricePerNight: 220,
            rating: 4.4,
            amenities: ["River Location", "Pool", "Gardens", "Park Shuttle Access"],
            kidFriendly: true,
            description: "Boutique lodge on the Virgin River near park entrance."
          }
        ],
        estimatedCost: 1100,
        transportToNext: {
          method: "car_rental",
          duration: "1h 45min",
          cost: 45,
          description: "Short scenic drive through red rock country",
          bookingInfo: "Highway 9 offers spectacular canyon views."
        }
      },
      {
        legId: "bryce-canyon-leg",
        destination: "Bryce Canyon National Park, Utah",
        duration: 4,
        description: "Otherworldly landscape of red rock spires called hoodoos rising from natural amphitheaters.",
        highlights: ["Bryce Amphitheater", "Sunset Point viewing", "Navajo Loop Trail"],
        activities: [
          "Bryce Amphitheater overlook tour",
          "Navajo Loop and Queen's Garden trail",
          "Sunset Point photography session",
          "Stargazing program (Dark Sky Park)"
        ],
        hotels: [
          {
            id: "bryce-canyon-lodge",
            name: "Bryce Canyon Lodge",
            type: "standard",
            pricePerNight: 200,
            rating: 4.2,
            amenities: ["Historic Lodge", "Restaurant", "In-Park Location", "Fireplace"],
            kidFriendly: true,
            description: "Historic 1920s lodge within the national park."
          }
        ],
        estimatedCost: 1070
      }
    ],
    totalDistance: "420 miles",
    totalTransportCost: 130,
    transportSummary: "Self-drive rental car with scenic highway routes"
  }
}

// Budget European Cities Circuit
export const budgetEuropeTrip: TripRecommendation = {
  tripId: "budget-europe-2024",
  destination: "Eastern European Discovery",
  duration: 16,
  estimatedCost: 1800,
  highlights: [
    "Prague's fairy-tale architecture",
    "Budapest thermal baths",
    "Vienna's imperial grandeur",
    "Budget-friendly accommodations"
  ],
  description: "Affordable exploration of Central Europe's most beautiful capitals, featuring stunning architecture, rich history, and excellent value for money.",
  activities: [
    "Prague Castle complex tour",
    "Budapest thermal bath experience",
    "Vienna palace and museum visits",
    "Traditional beer hall dining"
  ],
  season: "shoulder",
  kidFriendly: true,
  customizations: {
    hotelType: "budget",
    activities: ["Historical tours", "Architecture", "Local cuisine", "Walking tours"]
  },
  score: 85,
  type: "multi-destination",
  itinerary: {
    legs: [
      {
        legId: "prague-leg",
        destination: "Prague, Czech Republic",
        duration: 6,
        description: "The City of a Hundred Spires with fairy-tale architecture and affordable charm.",
        highlights: ["Prague Castle", "Charles Bridge", "Old Town Square"],
        activities: [
          "Prague Castle and St. Vitus Cathedral tour",
          "Charles Bridge and Lesser Town walk",
          "Old Town Square and Astronomical Clock",
          "Traditional Czech beer tasting"
        ],
        hotels: [
          {
            id: "hostel-one-home",
            name: "Hostel One Home", 
            type: "budget",
            pricePerNight: 35,
            rating: 4.3,
            amenities: ["Free WiFi", "Kitchen", "Common Area", "Laundry"],
            kidFriendly: true,
            description: "Modern hostel with private family rooms available."
          }
        ],
        estimatedCost: 520,
        transportToNext: {
          method: "train",
          duration: "7h 15min",
          cost: 45,
          description: "Comfortable train through beautiful Bohemian countryside",
          bookingInfo: "RegioJet offers good service with snacks included."
        }
      },
      {
        legId: "budapest-leg",
        destination: "Budapest, Hungary",
        duration: 5,
        description: "The Pearl of the Danube with magnificent thermal baths and stunning river views.",
        highlights: ["Széchenyi Thermal Baths", "Parliament Building", "Danube river cruise"],
        activities: [
          "Széchenyi Thermal Baths full day",
          "Parliament Building guided tour",
          "Buda Castle and Fisherman's Bastion",
          "Evening Danube river cruise"
        ],
        hotels: [
          {
            id: "maverick-city-lodge",
            name: "Maverick City Lodge",
            type: "budget",
            pricePerNight: 40,
            rating: 4.1,
            amenities: ["Central Location", "Free WiFi", "24/7 Reception", "Tours Desk"],
            kidFriendly: true,
            description: "Clean, modern hostel near major attractions."
          }
        ],
        estimatedCost: 480,
        transportToNext: {
          method: "train",
          duration: "2h 30min",
          cost: 35,
          description: "Frequent trains through beautiful Danube valley",
          bookingInfo: "ÖBB Railjet - modern, comfortable trains every 2 hours."
        }
      },
      {
        legId: "vienna-leg",
        destination: "Vienna, Austria",
        duration: 5,
        description: "Imperial capital with magnificent palaces, world-class museums, and coffee house culture.",
        highlights: ["Schönbrunn Palace", "St. Stephen's Cathedral", "Traditional coffee houses"],
        activities: [
          "Schönbrunn Palace and gardens tour",
          "Historic city center walking tour",
          "Naschmarkt food market visit",
          "Traditional Viennese coffee house experience"
        ],
        hotels: [
          {
            id: "wombats-city-hostel",
            name: "Wombats City Hostel Vienna",
            type: "budget",
            pricePerNight: 45,
            rating: 4.4,
            amenities: ["Modern Facilities", "Bar", "Breakfast", "Central Location"],
            kidFriendly: true,
            description: "Contemporary hostel with excellent facilities near city center."
          }
        ],
        estimatedCost: 720
      }
    ],
    totalDistance: "530 miles",
    totalTransportCost: 80,
    transportSummary: "Comfortable trains with scenic countryside views"
  }
}

// Export all multi-destination trips
export const multiDestinationTrips: TripRecommendation[] = [
  europeanFoodTour,
  asiaBackpackingTour,
  usNationalParksTrip,
  budgetEuropeTrip
]

/**
 * Get multi-destination trip by ID
 */
export function getMultiDestinationTrip(tripId: string): TripRecommendation | null {
  return multiDestinationTrips.find(trip => trip.tripId === tripId) || null
}

/**
 * Get multi-destination trips by budget range
 */
export function getMultiDestinationTripsByBudget(maxBudget: number): TripRecommendation[] {
  return multiDestinationTrips.filter(trip => trip.estimatedCost <= maxBudget)
}

/**
 * Get multi-destination trips by duration
 */
export function getMultiDestinationTripsByDuration(maxDuration: number): TripRecommendation[] {
  return multiDestinationTrips.filter(trip => trip.duration <= maxDuration)
}

/**
 * Get multi-destination trips by region/theme
 */
export function getMultiDestinationTripsByTheme(theme: string): TripRecommendation[] {
  const themeKeywords = theme.toLowerCase()
  
  return multiDestinationTrips.filter(trip => {
    const searchText = `${trip.destination} ${trip.description} ${trip.activities.join(' ')}`.toLowerCase()
    return searchText.includes(themeKeywords)
  })
}