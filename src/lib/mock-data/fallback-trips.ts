import { FallbackTripDatabase } from "@/types/travel"

export const fallbackTripDatabase: FallbackTripDatabase = {
  ultraBudget: {
    localDayTrips: [
      {
        name: "Local State Park Adventure",
        distance: "30 miles",
        activities: ["Hiking trails", "Picnic areas", "Wildlife viewing", "Photography"],
        estimatedCost: 45,
        duration: "full day"
      },
      {
        name: "Historic Downtown Walking Tour",
        distance: "15 miles", 
        activities: ["Self-guided tour", "Free museums", "Architecture viewing", "Local cafes"],
        estimatedCost: 25,
        duration: "half day"
      },
      {
        name: "Beach Day Trip",
        distance: "45 miles",
        activities: ["Swimming", "Beach games", "Packed lunch", "Sunset viewing"],
        estimatedCost: 35,
        duration: "full day"
      },
      {
        name: "Local Farmers Market & Park",
        distance: "10 miles",
        activities: ["Fresh produce shopping", "Free samples", "Playground", "Community events"],
        estimatedCost: 20,
        duration: "half day"
      },
      {
        name: "Scenic Drive & Lookout Points",
        distance: "60 miles",
        activities: ["Scenic driving", "Photo stops", "Hiking short trails", "Packed snacks"],
        estimatedCost: 40,
        duration: "full day"
      }
    ],
    freeActivities: [
      {
        id: "local-library-events",
        name: "Library Story Time & Activities",
        type: "cultural",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Free children's programs, story time, and educational activities at your local library."
      },
      {
        id: "community-festivals",
        name: "Community Festivals & Events",
        type: "cultural", 
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Free local festivals, concerts in the park, and community celebrations."
      },
      {
        id: "nature-walks",
        name: "Nature Walks & Bird Watching",
        type: "adventure",
        duration: 3,
        cost: 0,
        ageAppropriate: true,
        description: "Explore local trails, parks, and nature preserves for free outdoor fun."
      },
      {
        id: "free-museums",
        name: "Free Museum Days",
        type: "cultural",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Many museums offer free admission days - check local schedules."
      },
      {
        id: "playground-hopping",
        name: "Playground & Park Hopping",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Visit different playgrounds and parks throughout your area."
      }
    ],
    budgetTips: [
      {
        title: "Pack Your Own Meals",
        description: "Prepare sandwiches, snacks, and drinks at home to save 60-80% on food costs during day trips.",
        potentialSavings: "$30-50 per day",
        effort: "low"
      },
      {
        title: "Use Library Resources",
        description: "Many libraries offer free passes to museums, zoos, and attractions - ask your librarian!",
        potentialSavings: "$20-100 per visit",
        effort: "low"
      },
      {
        title: "Look for Free Events",
        description: "Check community calendars, Facebook events, and city websites for free activities and festivals.",
        potentialSavings: "$15-75 per event",
        effort: "low"
      },
      {
        title: "Group Activities",
        description: "Organize activities with other families to share costs for gas and group discounts.",
        potentialSavings: "$10-30 per activity",
        effort: "medium"
      },
      {
        title: "Off-Season Planning",
        description: "Plan future trips during off-peak times when prices are 40-60% lower.",
        potentialSavings: "$200-800 per trip",
        effort: "medium"
      }
    ]
  },

  lowBudget: {
    weekendGetaways: [
      {
        destination: "Regional Mountain Resort",
        duration: 2,
        highlights: ["Hiking trails", "Lake activities", "Small town charm", "Affordable dining"],
        totalCost: 320,
        transportation: "Drive (3 hours)"
      },
      {
        destination: "Coastal Beach Town",
        duration: 3,
        highlights: ["Beach access", "Seafood restaurants", "Lighthouse tour", "Boardwalk"],
        totalCost: 485,
        transportation: "Drive (4 hours)"
      },
      {
        destination: "Historic Small City",
        duration: 2,
        highlights: ["Museums", "Historic district", "Local festivals", "Budget hotels"],
        totalCost: 280,
        transportation: "Drive (2.5 hours)"
      },
      {
        destination: "National Park Gateway Town",
        duration: 3,
        highlights: ["Park access", "Visitor center", "Easy hiking", "Camping options"],
        totalCost: 375,
        transportation: "Drive (5 hours)"
      },
      {
        destination: "University Town Weekend",
        duration: 2,
        highlights: ["Campus tour", "College sports", "Student-friendly dining", "Cultural events"],
        totalCost: 245,
        transportation: "Drive (2 hours)"
      }
    ],
    campingOptions: [
      {
        name: "Pine Ridge State Park Campground",
        location: "Mountain region, 120 miles away",
        costPerNight: 25,
        amenities: ["Restrooms", "Showers", "Fire pits", "Hiking trails", "Lake access"],
        activities: ["Swimming", "Fishing", "Hiking", "Star gazing", "Wildlife watching"]
      },
      {
        name: "Sunset Beach Campground",
        location: "Coastal area, 180 miles away", 
        costPerNight: 35,
        amenities: ["Beach access", "Hot showers", "Camp store", "Playground", "WiFi"],
        activities: ["Beach games", "Surfing lessons", "Tide pooling", "Bonfire nights"]
      },
      {
        name: "Forest Glen Family Campground",
        location: "Forest preserve, 90 miles away",
        costPerNight: 28,
        amenities: ["Pool", "Mini golf", "Game room", "Laundry", "Pet friendly"],
        activities: ["Nature walks", "Bike rentals", "Crafts", "Movie nights"]
      },
      {
        name: "Desert Oasis RV & Tent Park",
        location: "Desert region, 200 miles away",
        costPerNight: 22,
        amenities: ["Pool", "Hot tub", "Desert tours", "Stargazing area"],
        activities: ["Desert hiking", "Rock climbing", "Photography", "Night sky viewing"]
      }
    ],
    budgetHotels: [
      {
        id: "comfort-inn-regional",
        name: "Comfort Inn Express",
        type: "budget",
        pricePerNight: 89,
        rating: 3.8,
        amenities: ["Free Breakfast", "Pool", "WiFi", "Pet Friendly"],
        kidFriendly: true,
        description: "Clean, comfortable rooms with family amenities at regional locations."
      },
      {
        id: "holiday-inn-express",
        name: "Holiday Inn Express & Suites",
        type: "budget",
        pricePerNight: 105,
        rating: 4.1,
        amenities: ["Free Breakfast", "Pool", "Fitness Center", "Business Center"],
        kidFriendly: true,
        description: "Reliable mid-range option with consistent quality and family features."
      },
      {
        id: "super-8-motel",
        name: "Super 8 by Wyndham",
        type: "budget",
        pricePerNight: 72,
        rating: 3.5,
        amenities: ["Free WiFi", "Continental Breakfast", "Pet Friendly"],
        kidFriendly: true,
        description: "Basic but clean accommodations with essential amenities."
      }
    ]
  },

  moderateBudget: {
    fullTrips: [
      {
        destination: "Great Smoky Mountains, Tennessee",
        days: [
          {
            day: 1,
            title: "Arrival & Gatlinburg Exploration",
            activities: [
              { time: "10:00 AM", activity: "Check into cabin rental", cost: 0 },
              { time: "1:00 PM", activity: "Lunch in Gatlinburg", cost: 45 },
              { time: "3:00 PM", activity: "SkyLift & SkyBridge", cost: 95 },
              { time: "7:00 PM", activity: "Dollywood dinner show", cost: 125 }
            ]
          },
          {
            day: 2,
            title: "National Park Adventures",
            activities: [
              { time: "8:00 AM", activity: "Cataract Falls hike", cost: 0 },
              { time: "12:00 PM", activity: "Picnic lunch in park", cost: 25 },
              { time: "2:00 PM", activity: "Visitor center & exhibits", cost: 0 },
              { time: "6:00 PM", activity: "BBQ dinner", cost: 85 }
            ]
          },
          {
            day: 3,
            title: "Family Fun & Departure",
            activities: [
              { time: "9:00 AM", activity: "Dollywood theme park", cost: 285 },
              { time: "12:00 PM", activity: "Lunch at park", cost: 55 },
              { time: "4:00 PM", activity: "Souvenir shopping", cost: 75 },
              { time: "6:00 PM", activity: "Departure" }
            ]
          }
        ],
        totalCost: 1650,
        includes: ["Cabin rental (2 nights)", "All meals", "Activities", "Park entrance"]
      },
      {
        destination: "Yellowstone National Park, Wyoming",
        days: [
          {
            day: 1,
            title: "West Entrance & Geysers",
            activities: [
              { time: "9:00 AM", activity: "Enter park & get maps", cost: 35 },
              { time: "11:00 AM", activity: "Old Faithful viewing", cost: 0 },
              { time: "1:00 PM", activity: "Lunch at Old Faithful Inn", cost: 68 },
              { time: "3:00 PM", activity: "Grand Prismatic Spring walk", cost: 0 },
              { time: "7:00 PM", activity: "Check into park lodge", cost: 0 }
            ]
          },
          {
            day: 2,
            title: "Wildlife & Grand Canyon",
            activities: [
              { time: "6:00 AM", activity: "Early morning wildlife drive", cost: 0 },
              { time: "9:00 AM", activity: "Breakfast at lodge", cost: 45 },
              { time: "11:00 AM", activity: "Grand Canyon of Yellowstone", cost: 0 },
              { time: "2:00 PM", activity: "Artist Point viewpoint", cost: 0 },
              { time: "6:00 PM", activity: "Ranger program", cost: 0 }
            ]
          }
        ],
        totalCost: 2100,
        includes: ["Park lodge (2 nights)", "All meals", "Park pass", "Guided tours"]
      }
    ],
    standardOptions: [
      {
        name: "Pacific Coast Highway Road Trip",
        destination: "California Coast",
        duration: 5,
        highlights: ["Scenic drives", "Coastal towns", "Beach activities", "Wine tasting"],
        price: 1850,
        includes: ["Hotel accommodations", "Car rental", "Some meals", "Activity passes"]
      },
      {
        name: "New England Fall Colors Tour",
        destination: "Vermont & New Hampshire", 
        duration: 4,
        highlights: ["Fall foliage", "Maple farms", "Covered bridges", "Historic towns"],
        price: 1420,
        includes: ["B&B accommodations", "Breakfast daily", "Scenic train ride", "Farm tours"]
      },
      {
        name: "Desert Southwest Explorer",
        destination: "Arizona & Utah",
        duration: 6,
        highlights: ["National parks", "Desert landscapes", "Native culture", "Stargazing"],
        price: 2280,
        includes: ["Mixed accommodations", "Park passes", "Guided tours", "Some meals"]
      },
      {
        name: "Great Lakes Circle Tour",
        destination: "Michigan & Wisconsin",
        duration: 4,
        highlights: ["Lakefront towns", "Lighthouse tours", "Local cuisine", "Water activities"],
        price: 1380,
        includes: ["Lakefront hotels", "Breakfast", "Boat tours", "Museum passes"]
      }
    ]
  }
}