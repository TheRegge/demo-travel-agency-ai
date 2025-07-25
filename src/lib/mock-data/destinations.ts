import { MockDestination } from "@/types/travel"

export const mockDestinations: MockDestination[] = [
  {
    id: "orlando-fl",
    name: "Orlando, Florida",
    category: "family-friendly",
    location: {
      country: "United States",
      region: "Florida",
      coordinates: { lat: 28.5383, lng: -81.3792 }
    },
    seasonalPricing: {
      peak: 3500,    // Summer/Holidays
      shoulder: 2800, // Spring/Fall
      offSeason: 2200 // Winter (except holidays)
    },
    kidFriendlyScore: 9.5,
    description: "The magical theme park capital of the world, home to Disney World, Universal Studios, and countless family attractions. Perfect for creating unforgettable memories with children of all ages.",
    imageUrl: "/images/destinations/orlando.jpg",
    activities: [
      {
        id: "disney-world",
        name: "Walt Disney World Resort",
        type: "attraction",
        duration: 8,
        cost: 109,
        ageAppropriate: true,
        description: "The most magical place on earth with four theme parks, water parks, and Disney Springs.",
        location: "Bay Lake"
      },
      {
        id: "universal-studios",
        name: "Universal Studios Florida",
        type: "attraction",
        duration: 8,
        cost: 109,
        ageAppropriate: true,
        description: "Movie-themed attractions including Harry Potter, Jurassic Park, and The Simpsons.",
        location: "Universal City"
      },
      {
        id: "character-dining",
        name: "Disney Character Dining",
        type: "dining",
        duration: 2,
        cost: 55,
        ageAppropriate: true,
        description: "Meet Disney characters while enjoying a delicious buffet meal.",
        location: "Various Disney Resorts"
      },
      {
        id: "icon-park",
        name: "ICON Park",
        type: "attraction",
        duration: 4,
        cost: 35,
        ageAppropriate: true,
        description: "Orlando's entertainment complex with The Wheel, Madame Tussauds, and SEA LIFE Aquarium.",
        location: "International Drive"
      }
    ],
    hotels: [
      {
        id: "disney-grand-floridian",
        name: "Disney's Grand Floridian Resort & Spa",
        type: "luxury",
        pricePerNight: 650,
        rating: 4.8,
        amenities: ["Pool", "Spa", "Disney Transportation", "Character Dining", "Beach"],
        kidFriendly: true,
        description: "Victorian elegance meets Disney magic at this flagship resort."
      },
      {
        id: "universal-cabana-bay",
        name: "Universal's Cabana Bay Beach Resort",
        type: "standard",
        pricePerNight: 180,
        rating: 4.3,
        amenities: ["Pool", "Food Court", "Bowling", "Early Park Admission"],
        kidFriendly: true,
        description: "Retro beach resort with family suites and Universal benefits."
      },
      {
        id: "holiday-inn-disney",
        name: "Holiday Inn Resort Orlando Suites",
        type: "budget",
        pricePerNight: 95,
        rating: 4.0,
        amenities: ["Pool", "Shuttle to Disney", "Kids Eat Free", "Game Room"],
        kidFriendly: true,
        description: "Family-friendly resort with spacious suites and Disney shuttle."
      }
    ],
    flightData: {
      averageCost: 320,
      duration: "varies by origin",
      airlines: ["Southwest", "JetBlue", "Delta", "American"],
      directFlight: true
    }
  },

  {
    id: "prague-czech",
    name: "Prague, Czech Republic",
    category: "budget",
    location: {
      country: "Czech Republic",
      region: "Central Europe",
      coordinates: { lat: 50.0755, lng: 14.4378 }
    },
    seasonalPricing: {
      peak: 1800,    // Summer
      shoulder: 1200, // Spring/Fall
      offSeason: 900  // Winter
    },
    kidFriendlyScore: 7.5,
    description: "A fairy-tale city with stunning medieval architecture, affordable prices, and rich history. One of Europe's most beautiful and budget-friendly capitals.",
    imageUrl: "/images/destinations/prague.jpg",
    activities: [
      {
        id: "prague-castle",
        name: "Prague Castle Complex",
        type: "cultural",
        duration: 4,
        cost: 15,
        ageAppropriate: true,
        description: "Explore the largest ancient castle complex in the world with stunning Gothic architecture.",
        location: "Hradčany"
      },
      {
        id: "charles-bridge",
        name: "Charles Bridge Walking Tour",
        type: "cultural",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Walk across the famous 14th-century bridge with baroque statues and street artists.",
        location: "Old Town"
      },
      {
        id: "prague-zoo",
        name: "Prague Zoo",
        type: "attraction",
        duration: 6,
        cost: 12,
        ageAppropriate: true,
        description: "One of the world's best zoos with over 4,000 animals and family-friendly exhibits.",
        location: "Troja"
      },
      {
        id: "traditional-dinner",
        name: "Traditional Czech Dinner",
        type: "dining",
        duration: 2,
        cost: 25,
        ageAppropriate: true,
        description: "Enjoy hearty Czech cuisine with goulash, dumplings, and local beer.",
        location: "Old Town Square"
      }
    ],
    hotels: [
      {
        id: "golden-well-prague",
        name: "Golden Well Hotel",
        type: "luxury",
        pricePerNight: 280,
        rating: 4.7,
        amenities: ["Spa", "Fine Dining", "Castle Views", "Concierge"],
        kidFriendly: false,
        description: "Baroque palace hotel with stunning castle and city views."
      },
      {
        id: "hotel-metamorphis",
        name: "Hotel Metamorphis",
        type: "standard",
        pricePerNight: 85,
        rating: 4.2,
        amenities: ["Free WiFi", "Breakfast", "Old Town Location", "Family Rooms"],
        kidFriendly: true,
        description: "Boutique hotel in the heart of Old Town with Gothic charm."
      },
      {
        id: "hostel-one-home",
        name: "Hostel One Home",
        type: "budget",
        pricePerNight: 25,
        rating: 3.8,
        amenities: ["Free WiFi", "Kitchen", "Common Area", "Laundry"],
        kidFriendly: false,
        description: "Modern hostel with private rooms and social atmosphere."
      }
    ],
    flightData: {
      averageCost: 650,
      duration: "8-12h with connections",
      airlines: ["Lufthansa", "Austrian Airlines", "Czech Airlines"],
      directFlight: false
    }
  },

  {
    id: "big-sur-california",
    name: "Big Sur, California",
    category: "scenic",
    location: {
      country: "United States",
      region: "California",
      coordinates: { lat: 36.2704, lng: -121.8081 }
    },
    seasonalPricing: {
      peak: 4200,    // Summer
      shoulder: 3200, // Spring/Fall  
      offSeason: 2400 // Winter
    },
    kidFriendlyScore: 6.5,
    description: "Breathtaking coastal scenery along Highway 1 with rugged cliffs, redwood forests, and luxury resorts. Perfect for romantic getaways and nature lovers.",
    imageUrl: "/images/destinations/big-sur.jpg",
    activities: [
      {
        id: "mcway-falls",
        name: "McWay Falls Overlook",
        type: "attraction",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Iconic 80-foot waterfall that drops directly onto the beach.",
        location: "Julia Pfeiffer Burns State Park"
      },
      {
        id: "bixby-bridge",
        name: "Bixby Creek Bridge",
        type: "attraction",
        duration: 1,
        cost: 0,
        ageAppropriate: true,
        description: "One of the most photographed bridges in California with stunning ocean views.",
        location: "Highway 1"
      },
      {
        id: "redwood-hike",
        name: "Redwood Forest Hiking",
        type: "adventure",
        duration: 4,
        cost: 10,
        ageAppropriate: true,
        description: "Hike among ancient giant redwoods in several state parks.",
        location: "Pfeiffer Big Sur State Park"
      },
      {
        id: "spa-treatment",
        name: "Luxury Spa Experience",
        type: "relaxation",
        duration: 3,
        cost: 250,
        ageAppropriate: false,
        description: "World-class spa treatments with ocean views and natural hot springs.",
        location: "Esalen Institute"
      }
    ],
    hotels: [
      {
        id: "ventana-big-sur",
        name: "Ventana Big Sur",
        type: "luxury",
        pricePerNight: 950,
        rating: 4.9,
        amenities: ["Spa", "Fine Dining", "Hot Tubs", "Yoga", "Hiking Trails"],
        kidFriendly: true,
        description: "Luxury resort nestled in the redwoods with stunning ocean views."
      },
      {
        id: "glen-oaks-big-sur",
        name: "Glen Oaks Big Sur",
        type: "standard",
        pricePerNight: 320,
        rating: 4.4,
        amenities: ["Restaurant", "Fire Pits", "Garden", "Pet Friendly"],
        kidFriendly: true,
        description: "Modern cabins and cottages in a redwood grove setting."
      },
      {
        id: "fernwood-resort",
        name: "Fernwood Resort",
        type: "budget",
        pricePerNight: 180,
        rating: 3.9,
        amenities: ["Restaurant", "Campground", "Store", "River Access"],
        kidFriendly: true,
        description: "Rustic cabins and camping on the Big Sur River."
      }
    ],
    flightData: {
      averageCost: 280,
      duration: "varies by origin",
      airlines: ["United", "American", "Southwest"],
      directFlight: true
    }
  },

  {
    id: "new-york-city",
    name: "New York City, New York",
    category: "urban",
    location: {
      country: "United States",
      region: "New York",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    seasonalPricing: {
      peak: 4800,    // Holidays/Summer
      shoulder: 3600, // Spring/Fall
      offSeason: 2800 // Winter
    },
    kidFriendlyScore: 8.0,
    description: "The city that never sleeps offers world-class museums, Broadway shows, iconic landmarks, and diverse neighborhoods. An urban adventure for all ages.",
    imageUrl: "/images/destinations/nyc.jpg",
    activities: [
      {
        id: "statue-of-liberty",
        name: "Statue of Liberty & Ellis Island",
        type: "cultural",
        duration: 6,
        cost: 25,
        ageAppropriate: true,
        description: "Visit America's most famous symbol of freedom and learn about immigration history.",
        location: "Liberty Island"
      },
      {
        id: "central-park",
        name: "Central Park",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Explore the city's green oasis with playgrounds, lakes, and seasonal activities.",
        location: "Manhattan"
      },
      {
        id: "broadway-show",
        name: "Broadway Show",
        type: "cultural",
        duration: 3,
        cost: 120,
        ageAppropriate: true,
        description: "Experience world-class theater in the heart of Times Square.",
        location: "Theater District"
      },
      {
        id: "brooklyn-bridge",
        name: "Brooklyn Bridge Walk",
        type: "attraction",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Walk across the iconic suspension bridge with stunning city views.",
        location: "Brooklyn/Manhattan"
      }
    ],
    hotels: [
      {
        id: "plaza-hotel",
        name: "The Plaza",
        type: "luxury",
        pricePerNight: 895,
        rating: 4.6,
        amenities: ["Spa", "Fine Dining", "Concierge", "Central Park Views"],
        kidFriendly: true,
        description: "Legendary luxury hotel overlooking Central Park."
      },
      {
        id: "pod-times-square",
        name: "Pod Times Square",
        type: "standard",
        pricePerNight: 185,
        rating: 4.1,
        amenities: ["Modern Rooms", "Rooftop Bar", "Fitness Center", "Tech Amenities"],
        kidFriendly: true,
        description: "Modern micro-hotel in the heart of Times Square."
      },
      {
        id: "ymca-west-side",
        name: "YMCA West Side",
        type: "budget",
        pricePerNight: 95,
        rating: 3.5,
        amenities: ["Gym", "Pool", "Basic Rooms", "Central Location"],
        kidFriendly: true,
        description: "Budget accommodation with fitness facilities near Lincoln Center."
      }
    ],
    flightData: {
      averageCost: 350,
      duration: "varies by origin",
      airlines: ["Delta", "American", "JetBlue", "United"],
      directFlight: true
    }
  },

  {
    id: "tokyo-japan",
    name: "Tokyo, Japan",
    category: "cultural",
    location: {
      country: "Japan",
      region: "Kanto",
      coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    seasonalPricing: {
      peak: 5200,    // Cherry blossom/Golden Week
      shoulder: 4000, // Summer/Fall
      offSeason: 3200 // Winter
    },
    kidFriendlyScore: 8.5,
    description: "A fascinating blend of ultra-modern and traditional culture, featuring incredible food, technology, temples, and family-friendly attractions like Tokyo Disneyland.",
    imageUrl: "/images/destinations/tokyo.jpg",
    activities: [
      {
        id: "tokyo-disneyland",
        name: "Tokyo Disneyland",
        type: "attraction",
        duration: 10,
        cost: 75,
        ageAppropriate: true,
        description: "Experience Disney magic with unique Japanese touches and exclusive attractions.",
        location: "Urayasu"
      },
      {
        id: "senso-ji-temple",
        name: "Senso-ji Temple",
        type: "cultural",
        duration: 3,
        cost: 0,
        ageAppropriate: true,
        description: "Tokyo's oldest temple with traditional architecture and street food.",
        location: "Asakusa"
      },
      {
        id: "shibuya-crossing",
        name: "Shibuya Crossing Experience",
        type: "cultural",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Experience the world's busiest pedestrian crossing and modern Tokyo.",
        location: "Shibuya"
      },
      {
        id: "sushi-making",
        name: "Sushi Making Class",
        type: "cultural",
        duration: 3,
        cost: 85,
        ageAppropriate: true,
        description: "Learn to make authentic sushi from a professional chef.",
        location: "Tsukiji"
      }
    ],
    hotels: [
      {
        id: "aman-tokyo",
        name: "Aman Tokyo",
        type: "luxury",
        pricePerNight: 1200,
        rating: 4.8,
        amenities: ["Spa", "Fine Dining", "City Views", "Traditional Design"],
        kidFriendly: false,
        description: "Ultra-luxury urban sanctuary with traditional Japanese aesthetics."
      },
      {
        id: "shibuya-excel-hotel",
        name: "Shibuya Excel Hotel Tokyu",
        type: "standard",
        pricePerNight: 220,
        rating: 4.3,
        amenities: ["Multiple Restaurants", "City Views", "Shopping Access", "Business Center"],
        kidFriendly: true,
        description: "Modern hotel directly connected to Shibuya Station."
      },
      {
        id: "khaosan-tokyo-kabuki",
        name: "Khaosan Tokyo Kabuki",
        type: "budget",
        pricePerNight: 45,
        rating: 4.0,
        amenities: ["Shared Kitchen", "Lounge", "Free WiFi", "Lockers"],
        kidFriendly: false,
        description: "Modern hostel in traditional Asakusa district."
      }
    ],
    flightData: {
      averageCost: 890,
      duration: "11-14h with connections",
      airlines: ["ANA", "JAL", "United", "Delta"],
      directFlight: true
    }
  },

  {
    id: "reykjavik-iceland",
    name: "Reykjavik, Iceland",
    category: "adventure",
    location: {
      country: "Iceland",
      region: "Capital Region",
      coordinates: { lat: 64.1466, lng: -21.9426 }
    },
    seasonalPricing: {
      peak: 3800,    // Summer (Northern Lights season)
      shoulder: 2900, // Spring/Fall
      offSeason: 2200 // Winter
    },
    kidFriendlyScore: 7.0,
    description: "Nordic charm meets natural wonders with geysers, waterfalls, Northern Lights, and the Blue Lagoon. A unique adventure destination for nature lovers.",
    imageUrl: "/images/destinations/reykjavik.jpg",
    activities: [
      {
        id: "blue-lagoon",
        name: "Blue Lagoon Geothermal Spa",
        type: "relaxation",
        duration: 4,
        cost: 65,
        ageAppropriate: true,
        description: "Relax in milky blue geothermal waters surrounded by lava fields.",
        location: "Grindavík"
      },
      {
        id: "northern-lights",
        name: "Northern Lights Tour",
        type: "adventure",
        duration: 6,
        cost: 95,
        ageAppropriate: true,
        description: "Hunt for the magical Aurora Borealis in the Icelandic wilderness.",
        location: "Various locations"
      },
      {
        id: "golden-circle",
        name: "Golden Circle Tour",
        type: "adventure",
        duration: 8,
        cost: 120,
        ageAppropriate: true,
        description: "Visit Gullfoss waterfall, Geysir hot springs, and Þingvellir National Park.",
        location: "South Iceland"
      },
      {
        id: "whale-watching",
        name: "Whale Watching",
        type: "adventure",
        duration: 3,
        cost: 85,
        ageAppropriate: true,
        description: "Spot whales, dolphins, and seabirds from Reykjavik's Old Harbor.",
        location: "Reykjavik Harbor"
      }
    ],
    hotels: [
      {
        id: "hotel-borg",
        name: "Hotel Borg",
        type: "luxury",
        pricePerNight: 380,
        rating: 4.5,
        amenities: ["Historic Charm", "Fine Dining", "City Center", "Spa Services"],
        kidFriendly: true,
        description: "Art Deco landmark hotel in the heart of Reykjavik since 1930."
      },
      {
        id: "fosshotel-reykjavik",
        name: "Fosshotel Reykjavík",
        type: "standard",
        pricePerNight: 165,
        rating: 4.2,
        amenities: ["Modern Rooms", "Restaurant", "Fitness Center", "Harbor Views"],
        kidFriendly: true,
        description: "Contemporary hotel with harbor views and Icelandic design."
      },
      {
        id: "kex-hostel",
        name: "Kex Hostel",
        type: "budget",
        pricePerNight: 55,
        rating: 4.1,
        amenities: ["Social Atmosphere", "Bar", "Shared Kitchen", "Cultural Events"],
        kidFriendly: false,
        description: "Hip hostel in converted biscuit factory with vibrant social scene."
      }
    ],
    flightData: {
      averageCost: 450,
      duration: "5-8h with connections",
      airlines: ["Icelandair", "Delta", "United"],
      directFlight: true
    }
  }
]

// Additional destinations to reach 10-15 total
export const additionalDestinations: MockDestination[] = [
  {
    id: "santorini-greece",
    name: "Santorini, Greece",
    category: "luxury",
    location: {
      country: "Greece",
      region: "Cyclades",
      coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    seasonalPricing: {
      peak: 4500,
      shoulder: 3200,
      offSeason: 2100
    },
    kidFriendlyScore: 6.0,
    description: "Iconic Greek island with whitewashed buildings, stunning sunsets, and luxury resorts. Perfect for romantic getaways and Mediterranean relaxation.",
    activities: [
      {
        id: "oia-sunset",
        name: "Oia Sunset Viewing",
        type: "attraction",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Watch the world's most famous sunset from the charming village of Oia."
      },
      {
        id: "wine-tasting",
        name: "Santorini Wine Tasting",
        type: "cultural",
        duration: 4,
        cost: 75,
        ageAppropriate: false,
        description: "Tour volcanic vineyards and taste unique Assyrtiko wines."
      }
    ],
    hotels: [
      {
        id: "grace-santorini",
        name: "Grace Hotel Santorini",
        type: "luxury",
        pricePerNight: 850,
        rating: 4.8,
        amenities: ["Infinity Pool", "Spa", "Fine Dining", "Caldera Views"],
        kidFriendly: false,
        description: "Ultra-luxury hotel with iconic infinity pool and caldera views."
      }
    ],
    flightData: {
      averageCost: 680,
      duration: "8-12h with connections",
      airlines: ["Aegean Airlines", "Lufthansa", "Turkish Airlines"],
      directFlight: false
    }
  },

  {
    id: "costa-rica-manuel-antonio",
    name: "Manuel Antonio, Costa Rica",
    category: "adventure",
    location: {
      country: "Costa Rica",
      region: "Puntarenas",
      coordinates: { lat: 9.3907, lng: -84.1298 }
    },
    seasonalPricing: {
      peak: 2800,
      shoulder: 2200,
      offSeason: 1800
    },
    kidFriendlyScore: 8.0,
    description: "Tropical paradise with pristine beaches, rainforest adventures, and incredible wildlife. Perfect for eco-conscious families seeking adventure.",
    activities: [
      {
        id: "manuel-antonio-park",
        name: "Manuel Antonio National Park",
        type: "adventure",
        duration: 6,
        cost: 25,
        ageAppropriate: true,
        description: "Spot monkeys, sloths, and tropical birds in pristine rainforest."
      },
      {
        id: "zip-lining",
        name: "Canopy Zip Line Tour",
        type: "adventure",
        duration: 4,
        cost: 65,
        ageAppropriate: true,
        description: "Soar through the rainforest canopy on thrilling zip lines."
      }
    ],
    hotels: [
      {
        id: "arenas-del-mar",
        name: "Arenas del Mar",
        type: "luxury",
        pricePerNight: 520,
        rating: 4.7,
        amenities: ["Beach Access", "Spa", "Multiple Pools", "Wildlife Viewing"],
        kidFriendly: true,
        description: "Luxury beachfront resort surrounded by national park."
      }
    ],
    flightData: {
      averageCost: 420,
      duration: "6-10h with connections",
      airlines: ["United", "American", "Copa Airlines"],
      directFlight: false
    }
  },

  {
    id: "marrakech-morocco",
    name: "Marrakech, Morocco",
    category: "cultural",
    location: {
      country: "Morocco",
      region: "Marrakech-Safi",
      coordinates: { lat: 31.6295, lng: -7.9811 }
    },
    seasonalPricing: {
      peak: 2400,
      shoulder: 1800,
      offSeason: 1400
    },
    kidFriendlyScore: 6.5,
    description: "Ancient imperial city with vibrant souks, stunning palaces, and authentic Moroccan culture. An exotic adventure with rich history and traditions.",
    activities: [
      {
        id: "jemaa-el-fnaa",
        name: "Jemaa el-Fnaa Square",
        type: "cultural",
        duration: 3,
        cost: 0,
        ageAppropriate: true,
        description: "Experience the heart of Marrakech with street performers and food stalls."
      },
      {
        id: "sahara-desert",
        name: "Sahara Desert Excursion",
        type: "adventure",
        duration: 24,
        cost: 180,
        ageAppropriate: true,
        description: "Camel trek and overnight camping in the Sahara Desert."
      }
    ],
    hotels: [
      {
        id: "la-mamounia",
        name: "La Mamounia",
        type: "luxury",
        pricePerNight: 650,
        rating: 4.9,
        amenities: ["Palace Grounds", "Spa", "Multiple Pools", "Fine Dining"],
        kidFriendly: true,
        description: "Legendary palace hotel with gardens and Moroccan luxury."
      }
    ],
    flightData: {
      averageCost: 580,
      duration: "7-11h with connections",
      airlines: ["Royal Air Maroc", "Air France", "Lufthansa"],
      directFlight: false
    }
  }
]

// Combine all destinations
export const allMockDestinations = [...mockDestinations, ...additionalDestinations]