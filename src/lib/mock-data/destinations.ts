import { MockDestination } from "@/types/travel"

export const mockDestinations: MockDestination[] = [
  // Venice - Romantic destination
  {
    id: "venice-italy",
    name: "Venice, Italy",
    category: "romantic",
    location: {
      country: "Italy",
      region: "Veneto",
      coordinates: { lat: 45.4408, lng: 12.3155 }
    },
    seasonalPricing: {
      peak: 4500,    // Summer/Carnival
      shoulder: 3500, // Spring/Fall
      offSeason: 2500 // Winter
    },
    kidFriendlyScore: 6.5,
    description: "The enchanting city of canals, gondolas, and timeless romance. Perfect for couples seeking an unforgettable romantic escape with stunning architecture and intimate dining experiences.",
    imageUrl: "/images/destinations/venice.jpg",
    activities: [
      {
        id: "gondola-ride",
        name: "Private Gondola Serenade",
        type: "romantic",
        duration: 1,
        cost: 150,
        ageAppropriate: true,
        description: "Glide through Venice's canals with a singing gondolier at sunset.",
        location: "Grand Canal"
      },
      {
        id: "doges-palace",
        name: "Doge's Palace & Bridge of Sighs",
        type: "cultural",
        duration: 3,
        cost: 35,
        ageAppropriate: true,
        description: "Explore the opulent palace and cross the famous Bridge of Sighs.",
        location: "Piazza San Marco"
      },
      {
        id: "murano-burano",
        name: "Murano & Burano Island Tour",
        type: "adventure",
        duration: 5,
        cost: 45,
        ageAppropriate: true,
        description: "Visit the colorful islands famous for glassmaking and lacemaking.",
        location: "Venetian Lagoon"
      }
    ],
    hotels: [
      {
        id: "gritti-palace",
        name: "The Gritti Palace, a Luxury Collection Hotel",
        type: "luxury",
        pricePerNight: 850,
        rating: 4.9,
        amenities: ["Canal View", "Spa", "Michelin Restaurant", "Concierge", "Private Water Taxi"],
        kidFriendly: false,
        description: "15th-century palazzo on the Grand Canal with legendary Venetian glamour."
      },
      {
        id: "hotel-danieli",
        name: "Hotel Danieli, a Luxury Collection Hotel",
        type: "luxury",
        pricePerNight: 700,
        rating: 4.7,
        amenities: ["Lagoon View", "Rooftop Restaurant", "Historic Building", "Spa"],
        kidFriendly: true,
        description: "Iconic hotel near St. Mark's Square with breathtaking lagoon views."
      },
      {
        id: "ca-sagredo",
        name: "Ca' Sagredo Hotel",
        type: "standard",
        pricePerNight: 350,
        rating: 4.5,
        amenities: ["Grand Canal View", "Art Collection", "Restaurant", "Bar"],
        kidFriendly: true,
        description: "Historic palace with museum-quality art and canal views."
      },
      {
        id: "hotel-ai-reali",
        name: "Hotel Ai Reali di Venezia",
        type: "standard",
        pricePerNight: 200,
        rating: 4.3,
        amenities: ["Breakfast", "Canal View Rooms", "Bar", "WiFi"],
        kidFriendly: true,
        description: "Boutique hotel in converted palace near Rialto Bridge."
      }
    ],
    flightData: {
      averageCost: 650,
      duration: "varies by origin",
      airlines: ["Alitalia", "Lufthansa", "Air France", "British Airways"],
      directFlight: true
    }
  },

  // Original destinations (keeping existing ones)
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
      }
    ],
    flightData: {
      averageCost: 890,
      duration: "11-14h with connections",
      airlines: ["ANA", "JAL", "United", "Delta"],
      directFlight: true
    }
  },

  // NEW DESTINATIONS - Adding 35+ more for variety

  {
    id: "bali-indonesia",
    name: "Bali, Indonesia",
    category: "luxury",
    location: {
      country: "Indonesia",
      region: "Lesser Sunda Islands",
      coordinates: { lat: -8.3405, lng: 115.0920 }
    },
    seasonalPricing: {
      peak: 3200,
      shoulder: 2400,
      offSeason: 1800
    },
    kidFriendlyScore: 7.5,
    description: "Tropical paradise with pristine beaches, ancient temples, lush rice terraces, and world-class spas. Perfect for relaxation and cultural exploration.",
    activities: [
      {
        id: "uluwatu-temple",
        name: "Uluwatu Temple Sunset",
        type: "cultural",
        duration: 4,
        cost: 20,
        ageAppropriate: true,
        description: "Ancient clifftop temple with spectacular sunset views and traditional Kecak dance."
      },
      {
        id: "ubud-rice-terraces",
        name: "Tegallalang Rice Terraces",
        type: "attraction",
        duration: 3,
        cost: 15,
        ageAppropriate: true,
        description: "Instagram-famous emerald rice terraces with traditional farming culture."
      }
    ],
    hotels: [
      {
        id: "amankila-bali",
        name: "Amankila",
        type: "luxury",
        pricePerNight: 950,
        rating: 4.9,
        amenities: ["Private Beach", "Spa", "Infinity Pools", "Cultural Tours"],
        kidFriendly: true,
        description: "Clifftop luxury resort with traditional Balinese architecture."
      },
      {
        id: "alaya-ubud",
        name: "Alaya Resort Ubud",
        type: "standard",
        pricePerNight: 180,
        rating: 4.4,
        amenities: ["Pool", "Spa", "Rice Field Views", "Cultural Activities"],
        kidFriendly: true,
        description: "Boutique resort in the heart of Ubud's cultural center."
      }
    ],
    flightData: {
      averageCost: 720,
      duration: "18-24h with connections",
      airlines: ["Garuda Indonesia", "Singapore Airlines", "Qatar Airways"],
      directFlight: false
    }
  },

  {
    id: "barcelona-spain",
    name: "Barcelona, Spain",
    category: "cultural",
    location: {
      country: "Spain",
      region: "Catalonia",
      coordinates: { lat: 41.3851, lng: 2.1734 }
    },
    seasonalPricing: {
      peak: 3800,
      shoulder: 2900,
      offSeason: 2100
    },
    kidFriendlyScore: 8.0,
    description: "Vibrant Catalan capital with Gaudí's architectural masterpieces, beautiful beaches, delicious tapas, and family-friendly attractions.",
    activities: [
      {
        id: "sagrada-familia",
        name: "Sagrada Família Basilica",
        type: "cultural",
        duration: 3,
        cost: 35,
        ageAppropriate: true,
        description: "Gaudí's unfinished masterpiece with stunning stained glass and unique architecture."
      },
      {
        id: "park-guell",
        name: "Park Güell",
        type: "attraction",
        duration: 2,
        cost: 10,
        ageAppropriate: true,
        description: "Whimsical park with colorful mosaics and panoramic city views."
      }
    ],
    hotels: [
      {
        id: "hotel-casa-fuster",
        name: "Hotel Casa Fuster",
        type: "luxury",
        pricePerNight: 420,
        rating: 4.6,
        amenities: ["Rooftop Pool", "Jazz Club", "Modernist Architecture", "Spa"],
        kidFriendly: true,
        description: "Modernist palace hotel with elegant design and city views."
      },
      {
        id: "hotel-barcelona-center",
        name: "Hotel Barcelona Center",
        type: "standard",
        pricePerNight: 150,
        rating: 4.1,
        amenities: ["Pool", "Central Location", "Family Rooms", "Restaurant"],
        kidFriendly: true,
        description: "Modern hotel near Sagrada Família with family amenities."
      }
    ],
    flightData: {
      averageCost: 550,
      duration: "7-10h with connections",
      airlines: ["Iberia", "Lufthansa", "Air France"],
      directFlight: true
    }
  },

  {
    id: "rome-italy",
    name: "Rome, Italy",
    category: "cultural",
    location: {
      country: "Italy",
      region: "Lazio",
      coordinates: { lat: 41.9028, lng: 12.4964 }
    },
    seasonalPricing: {
      peak: 4200,
      shoulder: 3200,
      offSeason: 2400
    },
    kidFriendlyScore: 7.0,
    description: "The Eternal City with ancient ruins, Vatican treasures, incredible cuisine, and 2,000 years of history around every corner.",
    activities: [
      {
        id: "colosseum-tour",
        name: "Colosseum & Roman Forum",
        type: "cultural",
        duration: 4,
        cost: 45,
        ageAppropriate: true,
        description: "Explore ancient Rome's most iconic amphitheater and forum ruins."
      },
      {
        id: "vatican-museums",
        name: "Vatican Museums & Sistine Chapel",
        type: "cultural",
        duration: 4,
        cost: 35,
        ageAppropriate: true,
        description: "World's greatest art collection including Michelangelo's masterpiece."
      }
    ],
    hotels: [
      {
        id: "hotel-de-russie",
        name: "Hotel de Russie",
        type: "luxury",
        pricePerNight: 680,
        rating: 4.7,
        amenities: ["Secret Garden", "Spa", "Fine Dining", "Historic Charm"],
        kidFriendly: true,
        description: "Luxury hotel with terraced gardens near Spanish Steps."
      },
      {
        id: "artemide-hotel",
        name: "Artemide Hotel",
        type: "standard",
        pricePerNight: 220,
        rating: 4.3,
        amenities: ["Central Location", "Modern Rooms", "Fitness Center", "Business Services"],
        kidFriendly: true,
        description: "Contemporary hotel near Termini Station and major attractions."
      }
    ],
    flightData: {
      averageCost: 620,
      duration: "8-12h with connections",
      airlines: ["Alitalia", "Lufthansa", "Delta"],
      directFlight: true
    }
  },

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
    description: "Iconic Greek island with whitewashed buildings, stunning sunsets, volcanic beaches, and luxury resorts. Perfect for romantic getaways.",
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
        id: "wine-tasting-santorini",
        name: "Santorini Wine Tasting",
        type: "cultural",
        duration: 4,
        cost: 75,
        ageAppropriate: false,
        description: "Tour volcanic vineyards and taste unique Assyrtiko wines with caldera views."
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
      },
      {
        id: "astra-suites",
        name: "Astra Suites",
        type: "standard",
        pricePerNight: 320,
        rating: 4.5,
        amenities: ["Pool", "Sunset Views", "Traditional Architecture", "Honeymoon Suites"],
        kidFriendly: false,
        description: "Luxury suites built into the cliff with traditional Cycladic design."
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
    id: "reykjavik-iceland",
    name: "Reykjavik, Iceland",
    category: "adventure",
    location: {
      country: "Iceland",
      region: "Capital Region",
      coordinates: { lat: 64.1466, lng: -21.9426 }
    },
    seasonalPricing: {
      peak: 3800,
      shoulder: 2900,
      offSeason: 2200
    },
    kidFriendlyScore: 7.0,
    description: "Nordic charm meets natural wonders with geysers, waterfalls, Northern Lights, and the Blue Lagoon. A unique adventure destination.",
    activities: [
      {
        id: "blue-lagoon",
        name: "Blue Lagoon Geothermal Spa",
        type: "relaxation",
        duration: 4,
        cost: 65,
        ageAppropriate: true,
        description: "Relax in milky blue geothermal waters surrounded by lava fields."
      },
      {
        id: "northern-lights",
        name: "Northern Lights Tour",
        type: "adventure",
        duration: 6,
        cost: 95,
        ageAppropriate: true,
        description: "Hunt for the magical Aurora Borealis in the Icelandic wilderness."
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
      }
    ],
    flightData: {
      averageCost: 450,
      duration: "5-8h with connections",
      airlines: ["Icelandair", "Delta", "United"],
      directFlight: true
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
    description: "Tropical paradise with pristine beaches, rainforest adventures, and incredible wildlife. Perfect for eco-conscious families.",
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
        id: "zip-lining-costa-rica",
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
      },
      {
        id: "hotel-costa-verde",
        name: "Hotel Costa Verde",
        type: "standard",
        pricePerNight: 180,
        rating: 4.1,
        amenities: ["Unique Rooms", "Restaurant", "Beach Access", "Wildlife Tours"],
        kidFriendly: true,
        description: "Unique hotel with airplane suite and sloth sanctuary."
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
    description: "Ancient imperial city with vibrant souks, stunning palaces, and authentic Moroccan culture. An exotic adventure with rich history.",
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
      },
      {
        id: "riad-kheirredine",
        name: "Riad Kheirredine",
        type: "standard",
        pricePerNight: 120,
        rating: 4.3,
        amenities: ["Traditional Architecture", "Rooftop Terrace", "Hammam", "Cultural Tours"],
        kidFriendly: true,
        description: "Authentic riad in the heart of the medina with traditional design."
      }
    ],
    flightData: {
      averageCost: 580,
      duration: "7-11h with connections",
      airlines: ["Royal Air Maroc", "Air France", "Lufthansa"],
      directFlight: false
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
      peak: 4800,
      shoulder: 3600,
      offSeason: 2800
    },
    kidFriendlyScore: 8.0,
    description: "The city that never sleeps offers world-class museums, Broadway shows, iconic landmarks, and diverse neighborhoods. An urban adventure for all ages.",
    activities: [
      {
        id: "statue-of-liberty",
        name: "Statue of Liberty & Ellis Island",
        type: "cultural",
        duration: 6,
        cost: 25,
        ageAppropriate: true,
        description: "Visit America's most famous symbol of freedom and learn about immigration history."
      },
      {
        id: "central-park",
        name: "Central Park",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Explore the city's green oasis with playgrounds, lakes, and seasonal activities."
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
    id: "amsterdam-netherlands",
    name: "Amsterdam, Netherlands",
    category: "cultural",
    location: {
      country: "Netherlands",
      region: "North Holland",
      coordinates: { lat: 52.3676, lng: 4.9041 }
    },
    seasonalPricing: {
      peak: 3400,
      shoulder: 2600,
      offSeason: 1900
    },
    kidFriendlyScore: 8.5,
    description: "Charming canal city with world-class museums, bike-friendly streets, beautiful architecture, and family-friendly attractions.",
    activities: [
      {
        id: "anne-frank-house",
        name: "Anne Frank House",
        type: "cultural",
        duration: 2,
        cost: 16,
        ageAppropriate: true,
        description: "Moving museum in the actual hiding place of Anne Frank during WWII."
      },
      {
        id: "canal-cruise",
        name: "Amsterdam Canal Cruise",
        type: "attraction",
        duration: 2,
        cost: 25,
        ageAppropriate: true,
        description: "Explore the UNESCO World Heritage canals from the water."
      }
    ],
    hotels: [
      {
        id: "waldorf-astoria-amsterdam",
        name: "Waldorf Astoria Amsterdam",
        type: "luxury",
        pricePerNight: 650,
        rating: 4.8,
        amenities: ["Canal Views", "Spa", "Fine Dining", "Historic Buildings"],
        kidFriendly: true,
        description: "Luxury hotel in 17th-century canal houses with garden."
      },
      {
        id: "hotel-v-nesplein",
        name: "Hotel V Nesplein",
        type: "standard",
        pricePerNight: 180,
        rating: 4.4,
        amenities: ["Modern Design", "Central Location", "Fitness Center", "Bar"],
        kidFriendly: true,
        description: "Stylish boutique hotel near museums and attractions."
      }
    ],
    flightData: {
      averageCost: 520,
      duration: "7-9h with connections",
      airlines: ["KLM", "Delta", "United"],
      directFlight: true
    }
  },

  {
    id: "cape-town-south-africa",
    name: "Cape Town, South Africa",
    category: "adventure",
    location: {
      country: "South Africa",
      region: "Western Cape",
      coordinates: { lat: -33.9249, lng: 18.4241 }
    },
    seasonalPricing: {
      peak: 3600,
      shoulder: 2800,
      offSeason: 2200
    },
    kidFriendlyScore: 7.5,
    description: "Stunning coastal city with Table Mountain, wine regions, penguin colonies, and rich cultural heritage. Adventure and beauty combined.",
    activities: [
      {
        id: "table-mountain",
        name: "Table Mountain Cable Car",
        type: "adventure",
        duration: 4,
        cost: 35,
        ageAppropriate: true,
        description: "Spectacular views from the flat-topped mountain overlooking the city."
      },
      {
        id: "penguin-colony",
        name: "Boulders Beach Penguins",
        type: "attraction",
        duration: 3,
        cost: 15,
        ageAppropriate: true,
        description: "Meet African penguins at this protected beach colony."
      }
    ],
    hotels: [
      {
        id: "belmond-mount-nelson",
        name: "Belmond Mount Nelson Hotel",
        type: "luxury",
        pricePerNight: 480,
        rating: 4.7,
        amenities: ["Gardens", "Spa", "Multiple Restaurants", "Mountain Views"],
        kidFriendly: true,
        description: "Historic pink hotel with beautiful gardens in the city center."
      },
      {
        id: "protea-hotel-fire-ice",
        name: "Protea Hotel Fire & Ice",
        type: "standard",
        pricePerNight: 120,
        rating: 4.2,
        amenities: ["Modern Design", "City Views", "Restaurant", "Fitness Center"],
        kidFriendly: true,
        description: "Contemporary hotel with striking design and city views."
      }
    ],
    flightData: {
      averageCost: 920,
      duration: "15-20h with connections",
      airlines: ["South African Airways", "Delta", "Emirates"],
      directFlight: false
    }
  },

  {
    id: "sydney-australia",
    name: "Sydney, Australia",
    category: "urban",
    location: {
      country: "Australia",
      region: "New South Wales",
      coordinates: { lat: -33.8688, lng: 151.2093 }
    },
    seasonalPricing: {
      peak: 4800,
      shoulder: 3800,
      offSeason: 3000
    },
    kidFriendlyScore: 8.5,
    description: "Iconic harbor city with Opera House, Harbour Bridge, beautiful beaches, and family-friendly attractions. Perfect blend of urban and beach life.",
    activities: [
      {
        id: "sydney-opera-house",
        name: "Sydney Opera House Tour",
        type: "cultural",
        duration: 2,
        cost: 45,
        ageAppropriate: true,
        description: "Explore the iconic performing arts venue with guided tours."
      },
      {
        id: "bondi-beach",
        name: "Bondi Beach",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "World-famous beach with golden sand and excellent surfing."
      }
    ],
    hotels: [
      {
        id: "park-hyatt-sydney",
        name: "Park Hyatt Sydney",
        type: "luxury",
        pricePerNight: 850,
        rating: 4.8,
        amenities: ["Harbor Views", "Spa", "Fine Dining", "Opera House Views"],
        kidFriendly: true,
        description: "Ultra-luxury hotel with unparalleled harbor and Opera House views."
      },
      {
        id: "quattro-on-astor",
        name: "Quattro on Astor",
        type: "standard",
        pricePerNight: 180,
        rating: 4.3,
        amenities: ["Self-Contained Apartments", "Kitchen", "Laundry", "Central Location"],
        kidFriendly: true,
        description: "Apartment-style accommodation perfect for families."
      }
    ],
    flightData: {
      averageCost: 1150,
      duration: "15-20h with connections",
      airlines: ["Qantas", "United", "Singapore Airlines"],
      directFlight: true
    }
  },

  {
    id: "london-england",
    name: "London, England",
    category: "cultural",
    location: {
      country: "United Kingdom",
      region: "England",
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    seasonalPricing: {
      peak: 4500,
      shoulder: 3400,
      offSeason: 2600
    },
    kidFriendlyScore: 8.0,
    description: "Historic capital with royal palaces, world-class museums, Harry Potter sites, and family-friendly attractions. Rich history meets modern culture.",
    activities: [
      {
        id: "tower-of-london",
        name: "Tower of London",
        type: "cultural",
        duration: 4,
        cost: 35,
        ageAppropriate: true,
        description: "Historic castle with Crown Jewels and fascinating medieval history."
      },
      {
        id: "london-eye",
        name: "London Eye",
        type: "attraction",
        duration: 1,
        cost: 32,
        ageAppropriate: true,
        description: "Giant observation wheel with panoramic views of the city."
      }
    ],
    hotels: [
      {
        id: "claridges-london",
        name: "Claridge's",
        type: "luxury",
        pricePerNight: 750,
        rating: 4.8,
        amenities: ["Historic Elegance", "Spa", "Fine Dining", "Afternoon Tea"],
        kidFriendly: true,
        description: "Legendary Art Deco hotel in the heart of Mayfair."
      },
      {
        id: "premier-inn-london",
        name: "Premier Inn London City",
        type: "standard",
        pricePerNight: 140,
        rating: 4.2,
        amenities: ["Family Rooms", "Restaurant", "Central Location", "Comfortable Beds"],
        kidFriendly: true,
        description: "Family-friendly hotel chain with comfortable accommodations."
      }
    ],
    flightData: {
      averageCost: 650,
      duration: "6-8h direct",
      airlines: ["British Airways", "Virgin Atlantic", "American"],
      directFlight: true
    }
  },

  {
    id: "dubai-uae",
    name: "Dubai, UAE",
    category: "luxury",
    location: {
      country: "United Arab Emirates",
      region: "Dubai",
      coordinates: { lat: 25.2048, lng: 55.2708 }
    },
    seasonalPricing: {
      peak: 5200,
      shoulder: 3800,
      offSeason: 2800
    },
    kidFriendlyScore: 8.0,
    description: "Ultra-modern city with record-breaking architecture, luxury shopping, desert adventures, and family theme parks. Opulence meets tradition.",
    activities: [
      {
        id: "burj-khalifa",
        name: "Burj Khalifa Observatory",
        type: "attraction",
        duration: 2,
        cost: 45,
        ageAppropriate: true,
        description: "Visit the world's tallest building with breathtaking city views."
      },
      {
        id: "desert-safari",
        name: "Desert Safari Adventure",
        type: "adventure",
        duration: 6,
        cost: 85,
        ageAppropriate: true,
        description: "Dune bashing, camel riding, and traditional Bedouin dinner."
      }
    ],
    hotels: [
      {
        id: "burj-al-arab",
        name: "Burj Al Arab Jumeirah",
        type: "luxury",
        pricePerNight: 1800,
        rating: 4.9,
        amenities: ["Iconic Design", "Butler Service", "Multiple Restaurants", "Private Beach"],
        kidFriendly: true,
        description: "World's most luxurious hotel with sail-shaped architecture."
      },
      {
        id: "hilton-dubai-jumeirah",
        name: "Hilton Dubai Jumeirah",
        type: "standard",
        pricePerNight: 220,
        rating: 4.4,
        amenities: ["Beach Access", "Multiple Pools", "Family Rooms", "Water Sports"],
        kidFriendly: true,
        description: "Beachfront resort with extensive family facilities."
      }
    ],
    flightData: {
      averageCost: 780,
      duration: "12-16h with connections",
      airlines: ["Emirates", "Etihad", "Delta"],
      directFlight: true
    }
  },

  {
    id: "paris-france",
    name: "Paris, France",
    category: "cultural",
    location: {
      country: "France",
      region: "Île-de-France",
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    seasonalPricing: {
      peak: 4200,
      shoulder: 3200,
      offSeason: 2400
    },
    kidFriendlyScore: 7.5,
    description: "City of Light with iconic landmarks, world-class museums, romantic atmosphere, and Disneyland Paris nearby. Art, culture, and magic combined.",
    activities: [
      {
        id: "eiffel-tower",
        name: "Eiffel Tower",
        type: "attraction",
        duration: 3,
        cost: 25,
        ageAppropriate: true,
        description: "Iconic iron tower with stunning city views from multiple levels."
      },
      {
        id: "louvre-museum",
        name: "Louvre Museum",
        type: "cultural",
        duration: 4,
        cost: 20,
        ageAppropriate: true,
        description: "World's largest art museum home to the Mona Lisa and Venus de Milo."
      }
    ],
    hotels: [
      {
        id: "le-meurice",
        name: "Le Meurice",
        type: "luxury",
        pricePerNight: 950,
        rating: 4.8,
        amenities: ["Palace Hotel", "Michelin Dining", "Spa", "Tuileries Views"],
        kidFriendly: true,
        description: "Legendary palace hotel overlooking the Tuileries Garden."
      },
      {
        id: "hotel-malte-opera",
        name: "Hotel Malte Opera",
        type: "standard",
        pricePerNight: 180,
        rating: 4.2,
        amenities: ["Central Location", "Family Rooms", "Historic Building", "Concierge"],
        kidFriendly: true,
        description: "Charming boutique hotel near Opera and major attractions."
      }
    ],
    flightData: {
      averageCost: 620,
      duration: "7-9h direct",
      airlines: ["Air France", "Delta", "American"],
      directFlight: true
    }
  },

  {
    id: "maldives",
    name: "Maldives",
    category: "luxury",
    location: {
      country: "Maldives",
      region: "Indian Ocean",
      coordinates: { lat: 3.2028, lng: 73.2207 }
    },
    seasonalPricing: {
      peak: 8500,
      shoulder: 6200,
      offSeason: 4800
    },
    kidFriendlyScore: 6.0,
    description: "Ultimate tropical paradise with overwater villas, pristine coral reefs, crystal-clear waters, and world-class luxury resorts.",
    activities: [
      {
        id: "snorkeling-maldives",
        name: "Coral Reef Snorkeling",
        type: "adventure",
        duration: 3,
        cost: 65,
        ageAppropriate: true,
        description: "Explore vibrant coral reefs with tropical fish and marine life."
      },
      {
        id: "dolphin-cruise",
        name: "Sunset Dolphin Cruise",
        type: "adventure",
        duration: 2,
        cost: 85,
        ageAppropriate: true,
        description: "Watch dolphins play in the sunset on a traditional dhoni boat."
      }
    ],
    hotels: [
      {
        id: "soneva-jani",
        name: "Soneva Jani",
        type: "luxury",
        pricePerNight: 2200,
        rating: 4.9,
        amenities: ["Overwater Villas", "Private Cinema", "Observatory", "Water Slides"],
        kidFriendly: true,
        description: "Ultra-luxury overwater villas with slides into the lagoon."
      },
      {
        id: "centara-ras-fushi",
        name: "Centara Ras Fushi",
        type: "standard",
        pricePerNight: 450,
        rating: 4.3,
        amenities: ["All-Inclusive", "Water Sports", "Spa", "Multiple Restaurants"],
        kidFriendly: true,
        description: "Adults-only resort with all-inclusive luxury and water activities."
      }
    ],
    flightData: {
      averageCost: 1200,
      duration: "16-20h with connections",
      airlines: ["Emirates", "Qatar Airways", "Singapore Airlines"],
      directFlight: false
    }
  },

  {
    id: "queenstown-new-zealand",
    name: "Queenstown, New Zealand",
    category: "adventure",
    location: {
      country: "New Zealand",
      region: "South Island",
      coordinates: { lat: -45.0312, lng: 168.6626 }
    },
    seasonalPricing: {
      peak: 4200,
      shoulder: 3200,
      offSeason: 2400
    },
    kidFriendlyScore: 7.0,
    description: "Adventure capital of the world with bungee jumping, skydiving, stunning landscapes, and Lord of the Rings filming locations.",
    activities: [
      {
        id: "milford-sound",
        name: "Milford Sound Cruise",
        type: "adventure",
        duration: 8,
        cost: 120,
        ageAppropriate: true,
        description: "Cruise through the stunning fiord with waterfalls and wildlife."
      },
      {
        id: "shotover-jet",
        name: "Shotover Jet Boat",
        type: "adventure",
        duration: 1,
        cost: 85,
        ageAppropriate: true,
        description: "High-speed jet boat ride through narrow canyon walls."
      }
    ],
    hotels: [
      {
        id: "eichardt-private-hotel",
        name: "Eichardt's Private Hotel",
        type: "luxury",
        pricePerNight: 850,
        rating: 4.8,
        amenities: ["Lake Views", "Private Beach", "Fine Dining", "Luxury Suites"],
        kidFriendly: false,
        description: "Lakefront luxury hotel with stunning mountain and lake views."
      },
      {
        id: "novotel-queenstown",
        name: "Novotel Queenstown Lakeside",
        type: "standard",
        pricePerNight: 250,
        rating: 4.4,
        amenities: ["Lake Views", "Family Rooms", "Restaurant", "Central Location"],
        kidFriendly: true,
        description: "Lakefront hotel with family-friendly amenities and stunning views."
      }
    ],
    flightData: {
      averageCost: 1100,
      duration: "13-18h with connections",
      airlines: ["Air New Zealand", "United", "Qantas"],
      directFlight: false
    }
  },

  {
    id: "vienna-austria",
    name: "Vienna, Austria",
    category: "cultural",
    location: {
      country: "Austria",
      region: "Vienna",
      coordinates: { lat: 48.2082, lng: 16.3738 }
    },
    seasonalPricing: {
      peak: 3200,
      shoulder: 2400,
      offSeason: 1800
    },
    kidFriendlyScore: 8.0,
    description: "Imperial city with grand palaces, classical music heritage, café culture, and family-friendly attractions. Elegance and culture combined.",
    activities: [
      {
        id: "schonbrunn-palace",
        name: "Schönbrunn Palace",
        type: "cultural",
        duration: 4,
        cost: 25,
        ageAppropriate: true,
        description: "Imperial palace with beautiful gardens and fascinating history."
      },
      {
        id: "vienna-concert",
        name: "Classical Music Concert",
        type: "cultural",
        duration: 2,
        cost: 65,
        ageAppropriate: true,
        description: "Experience world-class classical music in historic venues."
      }
    ],
    hotels: [
      {
        id: "hotel-sacher-vienna",
        name: "Hotel Sacher Wien",
        type: "luxury",
        pricePerNight: 650,
        rating: 4.7,
        amenities: ["Historic Luxury", "Original Sachertorte", "Spa", "Opera Views"],
        kidFriendly: true,
        description: "Legendary hotel famous for its original Sachertorte cake."
      },
      {
        id: "hotel-kaiserhof-vienna",
        name: "Hotel Kaiserhof Wien",
        type: "standard",
        pricePerNight: 140,
        rating: 4.2,
        amenities: ["Central Location", "Family Rooms", "Traditional Austrian", "Breakfast"],
        kidFriendly: true,
        description: "Traditional Austrian hotel near St. Stephen's Cathedral."
      }
    ],
    flightData: {
      averageCost: 580,
      duration: "8-10h with connections",
      airlines: ["Austrian Airlines", "Lufthansa", "United"],
      directFlight: true
    }
  },

  {
    id: "rio-de-janeiro-brazil",
    name: "Rio de Janeiro, Brazil",
    category: "cultural",
    location: {
      country: "Brazil",
      region: "Rio de Janeiro",
      coordinates: { lat: -22.9068, lng: -43.1729 }
    },
    seasonalPricing: {
      peak: 3800,
      shoulder: 2800,
      offSeason: 2200
    },
    kidFriendlyScore: 7.0,
    description: "Vibrant carnival city with iconic beaches, Christ the Redeemer statue, samba culture, and stunning natural beauty. Energy and passion everywhere.",
    activities: [
      {
        id: "christ-redeemer",
        name: "Christ the Redeemer",
        type: "attraction",
        duration: 4,
        cost: 35,
        ageAppropriate: true,
        description: "Iconic statue atop Corcovado Mountain with panoramic city views."
      },
      {
        id: "copacabana-beach",
        name: "Copacabana Beach",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "World-famous beach with golden sand and vibrant beach culture."
      }
    ],
    hotels: [
      {
        id: "copacabana-palace",
        name: "Copacabana Palace",
        type: "luxury",
        pricePerNight: 850,
        rating: 4.8,
        amenities: ["Beachfront", "Historic Luxury", "Multiple Pools", "Fine Dining"],
        kidFriendly: true,
        description: "Legendary Art Deco hotel on Copacabana Beach since 1923."
      },
      {
        id: "arena-copacabana",
        name: "Arena Copacabana Hotel",
        type: "standard",
        pricePerNight: 120,
        rating: 4.1,
        amenities: ["Beach Proximity", "Rooftop Pool", "Family Rooms", "City Views"],
        kidFriendly: true,
        description: "Modern hotel steps from Copacabana Beach with rooftop pool."
      }
    ],
    flightData: {
      averageCost: 650,
      duration: "9-12h with connections",
      airlines: ["LATAM", "American", "United"],
      directFlight: true
    }
  },

  {
    id: "banff-canada",
    name: "Banff, Canada",
    category: "adventure",
    location: {
      country: "Canada",
      region: "Alberta",
      coordinates: { lat: 51.1784, lng: -115.5708 }
    },
    seasonalPricing: {
      peak: 3600,
      shoulder: 2800,
      offSeason: 2000
    },
    kidFriendlyScore: 8.5,
    description: "Stunning mountain town in the Canadian Rockies with pristine lakes, wildlife, skiing, and outdoor adventures for the whole family.",
    activities: [
      {
        id: "lake-louise",
        name: "Lake Louise",
        type: "attraction",
        duration: 4,
        cost: 15,
        ageAppropriate: true,
        description: "Turquoise glacier-fed lake surrounded by snow-capped mountains."
      },
      {
        id: "banff-gondola",
        name: "Banff Gondola",
        type: "adventure",
        duration: 3,
        cost: 45,
        ageAppropriate: true,
        description: "Scenic gondola ride to mountain summit with interpretive center."
      }
    ],
    hotels: [
      {
        id: "fairmont-banff-springs",
        name: "Fairmont Banff Springs",
        type: "luxury",
        pricePerNight: 520,
        rating: 4.6,
        amenities: ["Castle Architecture", "Golf Course", "Spa", "Mountain Views"],
        kidFriendly: true,
        description: "Castle in the Rockies with luxury amenities and stunning views."
      },
      {
        id: "banff-ptarmigan-inn",
        name: "Banff Ptarmigan Inn",
        type: "standard",
        pricePerNight: 180,
        rating: 4.2,
        amenities: ["Mountain Views", "Family Rooms", "Indoor Pool", "Restaurant"],
        kidFriendly: true,
        description: "Family-friendly hotel in downtown Banff with mountain views."
      }
    ],
    flightData: {
      averageCost: 420,
      duration: "varies by origin",
      airlines: ["Air Canada", "WestJet", "United"],
      directFlight: true
    }
  },

  {
    id: "lisbon-portugal",
    name: "Lisbon, Portugal",
    category: "budget",
    location: {
      country: "Portugal",
      region: "Lisbon",
      coordinates: { lat: 38.7223, lng: -9.1393 }
    },
    seasonalPricing: {
      peak: 2800,
      shoulder: 2000,
      offSeason: 1500
    },
    kidFriendlyScore: 7.5,
    description: "Charming coastal capital with colorful neighborhoods, historic trams, delicious pastries, and family-friendly attractions. Great value for Europe.",
    activities: [
      {
        id: "belem-tower",
        name: "Belém Tower",
        type: "cultural",
        duration: 2,
        cost: 8,
        ageAppropriate: true,
        description: "UNESCO World Heritage fortress with maritime history and river views."
      },
      {
        id: "tram-28",
        name: "Tram 28 Tour",
        type: "attraction",
        duration: 2,
        cost: 3,
        ageAppropriate: true,
        description: "Historic tram ride through Lisbon's most charming neighborhoods."
      }
    ],
    hotels: [
      {
        id: "four-seasons-ritz-lisbon",
        name: "Four Seasons Hotel Ritz Lisbon",
        type: "luxury",
        pricePerNight: 420,
        rating: 4.7,
        amenities: ["City Views", "Spa", "Fine Dining", "Art Collection"],
        kidFriendly: true,
        description: "Luxury hotel with panoramic city views and art collection."
      },
      {
        id: "hotel-real-palacio",
        name: "Hotel Real Palácio",
        type: "standard",
        pricePerNight: 85,
        rating: 4.1,
        amenities: ["Central Location", "Family Rooms", "Traditional Portuguese", "Breakfast"],
        kidFriendly: true,
        description: "Traditional Portuguese hotel in the heart of Lisbon."
      }
    ],
    flightData: {
      averageCost: 480,
      duration: "6-9h with connections",
      airlines: ["TAP Air Portugal", "Lufthansa", "Delta"],
      directFlight: true
    }
  },

  {
    id: "singapore",
    name: "Singapore",
    category: "urban",
    location: {
      country: "Singapore",
      region: "Southeast Asia",
      coordinates: { lat: 1.3521, lng: 103.8198 }
    },
    seasonalPricing: {
      peak: 4200,
      shoulder: 3400,
      offSeason: 2800
    },
    kidFriendlyScore: 9.0,
    description: "Modern city-state with incredible attractions, diverse cuisine, beautiful gardens, and family-friendly activities. Perfect urban destination.",
    activities: [
      {
        id: "gardens-by-bay",
        name: "Gardens by the Bay",
        type: "attraction",
        duration: 4,
        cost: 25,
        ageAppropriate: true,
        description: "Futuristic gardens with Supertrees and climate-controlled domes."
      },
      {
        id: "singapore-zoo",
        name: "Singapore Zoo",
        type: "attraction",
        duration: 6,
        cost: 35,
        ageAppropriate: true,
        description: "World-renowned open-concept zoo with diverse wildlife."
      }
    ],
    hotels: [
      {
        id: "marina-bay-sands",
        name: "Marina Bay Sands",
        type: "luxury",
        pricePerNight: 480,
        rating: 4.6,
        amenities: ["Infinity Pool", "Casino", "Shopping", "Multiple Restaurants"],
        kidFriendly: true,
        description: "Iconic hotel with world-famous infinity pool and city views."
      },
      {
        id: "park-royal-pickering",
        name: "PARKROYAL on Pickering",
        type: "standard",
        pricePerNight: 220,
        rating: 4.4,
        amenities: ["Garden Architecture", "Pool", "Family Rooms", "Central Location"],
        kidFriendly: true,
        description: "Award-winning green hotel with stunning garden architecture."
      }
    ],
    flightData: {
      averageCost: 820,
      duration: "18-22h with connections",
      airlines: ["Singapore Airlines", "United", "Emirates"],
      directFlight: true
    }
  },

  {
    id: "istanbul-turkey",
    name: "Istanbul, Turkey",
    category: "cultural",
    location: {
      country: "Turkey",
      region: "Marmara",
      coordinates: { lat: 41.0082, lng: 28.9784 }
    },
    seasonalPricing: {
      peak: 2600,
      shoulder: 1900,
      offSeason: 1400
    },
    kidFriendlyScore: 7.0,
    description: "Fascinating city bridging Europe and Asia with rich history, stunning mosques, vibrant bazaars, and delicious cuisine. East meets West.",
    activities: [
      {
        id: "hagia-sophia",
        name: "Hagia Sophia",
        type: "cultural",
        duration: 2,
        cost: 15,
        ageAppropriate: true,
        description: "Magnificent former cathedral and mosque with stunning Byzantine architecture."
      },
      {
        id: "grand-bazaar",
        name: "Grand Bazaar",
        type: "cultural",
        duration: 3,
        cost: 0,
        ageAppropriate: true,
        description: "Historic covered market with thousands of shops and traditional crafts."
      }
    ],
    hotels: [
      {
        id: "ciragan-palace-kempinski",
        name: "Çırağan Palace Kempinski",
        type: "luxury",
        pricePerNight: 650,
        rating: 4.8,
        amenities: ["Bosphorus Views", "Ottoman Palace", "Spa", "Fine Dining"],
        kidFriendly: true,
        description: "Former Ottoman palace on the Bosphorus with luxury amenities."
      },
      {
        id: "hotel-sultania",
        name: "Hotel Sultania",
        type: "standard",
        pricePerNight: 120,
        rating: 4.2,
        amenities: ["Historic District", "Traditional Architecture", "Rooftop Terrace", "Family Rooms"],
        kidFriendly: true,
        description: "Boutique hotel in historic Sultanahmet with traditional Turkish design."
      }
    ],
    flightData: {
      averageCost: 620,
      duration: "9-13h with connections",
      airlines: ["Turkish Airlines", "Lufthansa", "Delta"],
      directFlight: true
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
      peak: 4200,
      shoulder: 3200,
      offSeason: 2400
    },
    kidFriendlyScore: 6.5,
    description: "Breathtaking coastal scenery along Highway 1 with rugged cliffs, redwood forests, and luxury resorts. Perfect for romantic getaways and nature lovers.",
    activities: [
      {
        id: "mcway-falls",
        name: "McWay Falls Overlook",
        type: "attraction",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Iconic 80-foot waterfall that drops directly onto the beach."
      },
      {
        id: "bixby-bridge",
        name: "Bixby Creek Bridge",
        type: "attraction",
        duration: 1,
        cost: 0,
        ageAppropriate: true,
        description: "One of the most photographed bridges in California with stunning ocean views."
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
    id: "edinburgh-scotland",
    name: "Edinburgh, Scotland",
    category: "cultural",
    location: {
      country: "United Kingdom",
      region: "Scotland",
      coordinates: { lat: 55.9533, lng: -3.1883 }
    },
    seasonalPricing: {
      peak: 3200,
      shoulder: 2400,
      offSeason: 1800
    },
    kidFriendlyScore: 7.5,
    description: "Historic Scottish capital with medieval castle, royal mile, whisky culture, and stunning architecture. Rich heritage and Highland charm.",
    activities: [
      {
        id: "edinburgh-castle",
        name: "Edinburgh Castle",
        type: "cultural",
        duration: 4,
        cost: 25,
        ageAppropriate: true,
        description: "Historic fortress on Castle Rock with Crown Jewels and Scottish history."
      },
      {
        id: "royal-mile",
        name: "Royal Mile Walking Tour",
        type: "cultural",
        duration: 3,
        cost: 15,
        ageAppropriate: true,
        description: "Historic street connecting castle to palace with shops and attractions."
      }
    ],
    hotels: [
      {
        id: "waldorf-astoria-edinburgh",
        name: "The Waldorf Astoria Edinburgh",
        type: "luxury",
        pricePerNight: 450,
        rating: 4.7,
        amenities: ["Historic Building", "Spa", "Fine Dining", "Castle Views"],
        kidFriendly: true,
        description: "Luxury hotel in converted Edwardian railway building."
      },
      {
        id: "premier-inn-edinburgh",
        name: "Premier Inn Edinburgh City Centre",
        type: "standard",
        pricePerNight: 120,
        rating: 4.2,
        amenities: ["Central Location", "Family Rooms", "Restaurant", "Comfortable Beds"],
        kidFriendly: true,
        description: "Family-friendly hotel in the heart of Edinburgh."
      }
    ],
    flightData: {
      averageCost: 680,
      duration: "7-10h with connections",
      airlines: ["British Airways", "Virgin Atlantic", "KLM"],
      directFlight: false
    }
  },

  {
    id: "kyoto-japan",
    name: "Kyoto, Japan",
    category: "cultural",
    location: {
      country: "Japan",
      region: "Kansai",
      coordinates: { lat: 35.0116, lng: 135.7681 }
    },
    seasonalPricing: {
      peak: 4800,
      shoulder: 3600,
      offSeason: 2800
    },
    kidFriendlyScore: 8.0,
    description: "Ancient capital with thousands of temples, traditional gardens, geisha districts, and cultural experiences. Japan's cultural heart.",
    activities: [
      {
        id: "fushimi-inari",
        name: "Fushimi Inari Shrine",
        type: "cultural",
        duration: 3,
        cost: 0,
        ageAppropriate: true,
        description: "Famous shrine with thousands of vermillion torii gates up the mountain."
      },
      {
        id: "bamboo-grove",
        name: "Arashiyama Bamboo Grove",
        type: "attraction",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Magical bamboo forest with towering stalks and filtered light."
      }
    ],
    hotels: [
      {
        id: "hoshinoya-kyoto",
        name: "Hoshinoya Kyoto",
        type: "luxury",
        pricePerNight: 1200,
        rating: 4.9,
        amenities: ["Traditional Ryokan", "River Setting", "Kaiseki Dining", "Tea Ceremony"],
        kidFriendly: false,
        description: "Ultra-luxury ryokan in historic Arashiyama district."
      },
      {
        id: "kyoto-tower-hotel",
        name: "Kyoto Tower Hotel",
        type: "standard",
        pricePerNight: 180,
        rating: 4.3,
        amenities: ["Central Location", "Multiple Restaurants", "Family Rooms", "Tower Views"],
        kidFriendly: true,
        description: "Modern hotel near Kyoto Station with convenient access."
      }
    ],
    flightData: {
      averageCost: 890,
      duration: "11-14h with connections",
      airlines: ["ANA", "JAL", "United"],
      directFlight: true
    }
  },

  {
    id: "vancouver-canada",
    name: "Vancouver, Canada",
    category: "scenic",
    location: {
      country: "Canada",
      region: "British Columbia",
      coordinates: { lat: 49.2827, lng: -123.1207 }
    },
    seasonalPricing: {
      peak: 3800,
      shoulder: 2900,
      offSeason: 2200
    },
    kidFriendlyScore: 8.5,
    description: "Beautiful coastal city with mountains, ocean, parks, and multicultural cuisine. Perfect blend of urban amenities and natural beauty.",
    activities: [
      {
        id: "stanley-park",
        name: "Stanley Park & Seawall",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Massive urban park with seawall, beaches, and forest trails."
      },
      {
        id: "capilano-bridge",
        name: "Capilano Suspension Bridge",
        type: "adventure",
        duration: 3,
        cost: 45,
        ageAppropriate: true,
        description: "Thrilling suspension bridge through temperate rainforest canopy."
      }
    ],
    hotels: [
      {
        id: "fairmont-hotel-vancouver",
        name: "Fairmont Hotel Vancouver",
        type: "luxury",
        pricePerNight: 380,
        rating: 4.6,
        amenities: ["Historic Landmark", "Downtown Location", "Spa", "Fine Dining"],
        kidFriendly: true,
        description: "Historic castle-like hotel in downtown Vancouver since 1939."
      },
      {
        id: "blue-horizon-hotel",
        name: "Blue Horizon Hotel",
        type: "standard",
        pricePerNight: 160,
        rating: 4.1,
        amenities: ["City Views", "Kitchenettes", "Pool", "Central Location"],
        kidFriendly: true,
        description: "All-suite hotel with kitchenettes and panoramic city views."
      }
    ],
    flightData: {
      averageCost: 380,
      duration: "varies by origin",
      airlines: ["Air Canada", "WestJet", "Alaska Airlines"],
      directFlight: true
    }
  },

  {
    id: "phuket-thailand",
    name: "Phuket, Thailand",
    category: "budget",
    location: {
      country: "Thailand",
      region: "Southern Thailand",
      coordinates: { lat: 7.8804, lng: 98.3923 }
    },
    seasonalPricing: {
      peak: 2400,
      shoulder: 1800,
      offSeason: 1400
    },
    kidFriendlyScore: 8.0,
    description: "Tropical island paradise with beautiful beaches, affordable luxury, Thai culture, and family-friendly resorts. Great value destination.",
    activities: [
      {
        id: "phi-phi-islands",
        name: "Phi Phi Islands Day Trip",
        type: "adventure",
        duration: 8,
        cost: 65,
        ageAppropriate: true,
        description: "Visit stunning limestone islands with crystal-clear waters and beaches."
      },
      {
        id: "big-buddha-phuket",
        name: "Big Buddha Temple",
        type: "cultural",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Massive white marble Buddha statue with panoramic island views."
      }
    ],
    hotels: [
      {
        id: "amanpuri-phuket",
        name: "Amanpuri",
        type: "luxury",
        pricePerNight: 1200,
        rating: 4.9,
        amenities: ["Private Beach", "Spa", "Multiple Pools", "Thai Architecture"],
        kidFriendly: true,
        description: "Ultra-luxury resort with traditional Thai pavilions and private beach."
      },
      {
        id: "novotel-phuket-vintage",
        name: "Novotel Phuket Vintage Park",
        type: "standard",
        pricePerNight: 85,
        rating: 4.2,
        amenities: ["Family Rooms", "Pool", "Central Location", "Restaurant"],
        kidFriendly: true,
        description: "Family-friendly hotel with pool and convenient Patong location."
      }
    ],
    flightData: {
      averageCost: 780,
      duration: "18-24h with connections",
      airlines: ["Thai Airways", "Singapore Airlines", "Emirates"],
      directFlight: false
    }
  },

  {
    id: "budapest-hungary",
    name: "Budapest, Hungary",
    category: "budget",
    location: {
      country: "Hungary",
      region: "Central Hungary",
      coordinates: { lat: 47.4979, lng: 19.0402 }
    },
    seasonalPricing: {
      peak: 2200,
      shoulder: 1600,
      offSeason: 1200
    },
    kidFriendlyScore: 7.5,
    description: "Beautiful Danube river city with thermal baths, grand architecture, affordable prices, and rich cultural heritage. Europe's best value.",
    activities: [
      {
        id: "szechenyi-baths",
        name: "Széchenyi Thermal Baths",
        type: "relaxation",
        duration: 4,
        cost: 20,
        ageAppropriate: true,
        description: "Historic thermal baths with indoor and outdoor pools and medicinal waters."
      },
      {
        id: "parliament-building",
        name: "Hungarian Parliament Building",
        type: "cultural",
        duration: 2,
        cost: 15,
        ageAppropriate: true,
        description: "Stunning neo-Gothic parliament building with guided tours."
      }
    ],
    hotels: [
      {
        id: "four-seasons-gresham-palace",
        name: "Four Seasons Hotel Gresham Palace",
        type: "luxury",
        pricePerNight: 420,
        rating: 4.8,
        amenities: ["Art Nouveau Architecture", "Danube Views", "Spa", "Fine Dining"],
        kidFriendly: true,
        description: "Art Nouveau palace hotel overlooking the Danube River."
      },
      {
        id: "hotel-moments-budapest",
        name: "Hotel Moments Budapest",
        type: "standard",
        pricePerNight: 90,
        rating: 4.3,
        amenities: ["Central Location", "Modern Design", "Family Rooms", "Breakfast"],
        kidFriendly: true,
        description: "Boutique hotel in historic city center with contemporary design."
      }
    ],
    flightData: {
      averageCost: 580,
      duration: "8-12h with connections",
      airlines: ["Wizz Air", "Lufthansa", "Austrian Airlines"],
      directFlight: false
    }
  },

  {
    id: "savannah-georgia",
    name: "Savannah, Georgia",
    category: "cultural",
    location: {
      country: "United States",
      region: "Georgia",
      coordinates: { lat: 32.0835, lng: -81.0998 }
    },
    seasonalPricing: {
      peak: 2800,
      shoulder: 2100,
      offSeason: 1600
    },
    kidFriendlyScore: 7.0,
    description: "Historic Southern charm with antebellum architecture, oak-lined squares, ghost tours, and rich cultural heritage. Quintessential American South.",
    activities: [
      {
        id: "historic-district-tour",
        name: "Historic District Trolley Tour",
        type: "cultural",
        duration: 3,
        cost: 25,
        ageAppropriate: true,
        description: "Explore beautiful historic squares and antebellum architecture."
      },
      {
        id: "forsyth-park",
        name: "Forsyth Park",
        type: "attraction",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Beautiful 30-acre park with iconic fountain and playground."
      }
    ],
    hotels: [
      {
        id: "mansion-on-forsyth-park",
        name: "The Mansion on Forsyth Park",
        type: "luxury",
        pricePerNight: 380,
        rating: 4.6,
        amenities: ["Historic Mansion", "Art Collection", "Spa", "Fine Dining"],
        kidFriendly: true,
        description: "Luxury boutique hotel with contemporary art and historic charm."
      },
      {
        id: "homewood-suites-savannah",
        name: "Homewood Suites Savannah Historic District",
        type: "standard",
        pricePerNight: 140,
        rating: 4.2,
        amenities: ["Suites", "Kitchen", "Pool", "Complimentary Breakfast"],
        kidFriendly: true,
        description: "All-suite hotel with kitchens perfect for families."
      }
    ],
    flightData: {
      averageCost: 280,
      duration: "varies by origin",
      airlines: ["Delta", "American", "United"],
      directFlight: true
    }
  },

  {
    id: "krakow-poland",
    name: "Krakow, Poland",
    category: "budget",
    location: {
      country: "Poland",
      region: "Lesser Poland",
      coordinates: { lat: 50.0647, lng: 19.9450 }
    },
    seasonalPricing: {
      peak: 1800,
      shoulder: 1300,
      offSeason: 1000
    },
    kidFriendlyScore: 7.0,
    description: "Medieval city with stunning architecture, rich history, affordable prices, and proximity to Auschwitz. Europe's hidden gem.",
    activities: [
      {
        id: "wawel-castle",
        name: "Wawel Royal Castle",
        type: "cultural",
        duration: 3,
        cost: 12,
        ageAppropriate: true,
        description: "Historic royal residence with beautiful courtyards and state rooms."
      },
      {
        id: "main-market-square",
        name: "Main Market Square",
        type: "cultural",
        duration: 2,
        cost: 0,
        ageAppropriate: true,
        description: "Medieval Europe's largest market square with St. Mary's Basilica."
      }
    ],
    hotels: [
      {
        id: "hotel-copernicus",
        name: "Hotel Copernicus",
        type: "luxury",
        pricePerNight: 220,
        rating: 4.7,
        amenities: ["Historic Building", "Spa", "Fine Dining", "Castle Views"],
        kidFriendly: true,
        description: "Luxury hotel in 14th-century building near Wawel Castle."
      },
      {
        id: "hotel-krolewski",
        name: "Hotel Królewski",
        type: "standard",
        pricePerNight: 65,
        rating: 4.1,
        amenities: ["Central Location", "Traditional Polish", "Family Rooms", "Restaurant"],
        kidFriendly: true,
        description: "Traditional Polish hotel in the heart of Old Town."
      }
    ],
    flightData: {
      averageCost: 520,
      duration: "8-12h with connections",
      airlines: ["LOT Polish Airlines", "Lufthansa", "Wizz Air"],
      directFlight: false
    }
  },

  {
    id: "charleston-south-carolina",
    name: "Charleston, South Carolina",
    category: "cultural",
    location: {
      country: "United States",
      region: "South Carolina",
      coordinates: { lat: 32.7767, lng: -79.9311 }
    },
    seasonalPricing: {
      peak: 3200,
      shoulder: 2400,
      offSeason: 1800
    },
    kidFriendlyScore: 7.5,
    description: "Historic Southern city with antebellum mansions, horse-drawn carriages, award-winning cuisine, and charming cobblestone streets.",
    activities: [
      {
        id: "carriage-tour-charleston",
        name: "Horse-Drawn Carriage Tour",
        type: "cultural",
        duration: 2,
        cost: 28,
        ageAppropriate: true,
        description: "Explore historic district in authentic horse-drawn carriage."
      },
      {
        id: "magnolia-plantation",
        name: "Magnolia Plantation & Gardens",
        type: "cultural",
        duration: 4,
        cost: 25,
        ageAppropriate: true,
        description: "Historic plantation with beautiful gardens and wildlife."
      }
    ],
    hotels: [
      {
        id: "ocean-house-charleston",
        name: "The Ocean House",
        type: "luxury",
        pricePerNight: 450,
        rating: 4.7,
        amenities: ["Beachfront", "Spa", "Fine Dining", "Golf Course"],
        kidFriendly: true,
        description: "Luxury resort on Kiawah Island with championship golf."
      },
      {
        id: "hampton-inn-charleston",
        name: "Hampton Inn & Suites Charleston Historic District",
        type: "standard",
        pricePerNight: 160,
        rating: 4.3,
        amenities: ["Pool", "Fitness Center", "Complimentary Breakfast", "Central Location"],
        kidFriendly: true,
        description: "Modern hotel in historic district with family amenities."
      }
    ],
    flightData: {
      averageCost: 320,
      duration: "varies by origin",
      airlines: ["American", "Delta", "Southwest"],
      directFlight: true
    }
  },

  // CARIBBEAN DESTINATIONS
  {
    id: "barbados",
    name: "Barbados",
    category: "luxury",
    location: {
      country: "Barbados",
      region: "Caribbean",
      coordinates: { lat: 13.1939, lng: -59.5432 }
    },
    seasonalPricing: {
      peak: 4800,    // Winter (Dec-Apr)
      shoulder: 3600, // Spring/Fall
      offSeason: 2800 // Summer (hurricane season)
    },
    kidFriendlyScore: 8.5,
    description: "Sophisticated Caribbean island with pristine beaches, rum distilleries, British colonial charm, and luxury resorts. Perfect blend of culture and relaxation.",
    activities: [
      {
        id: "harrison-cave",
        name: "Harrison's Cave",
        type: "adventure",
        duration: 3,
        cost: 35,
        ageAppropriate: true,
        description: "Explore stunning underground limestone caverns on an electric tram tour."
      },
      {
        id: "rum-distillery-tour",
        name: "Mount Gay Rum Distillery",
        type: "cultural",
        duration: 2,
        cost: 25,
        ageAppropriate: false,
        description: "Learn about rum production at the world's oldest rum distillery since 1703."
      },
      {
        id: "catamaran-cruise",
        name: "Catamaran Snorkel Cruise",
        type: "adventure",
        duration: 6,
        cost: 85,
        ageAppropriate: true,
        description: "Sail the crystal-clear waters and snorkel with sea turtles."
      }
    ],
    hotels: [
      {
        id: "sandy-lane-barbados",
        name: "Sandy Lane",
        type: "luxury",
        pricePerNight: 1400,
        rating: 4.9,
        amenities: ["Private Beach", "Golf Course", "Spa", "Multiple Restaurants", "Kids Club"],
        kidFriendly: true,
        description: "Ultra-luxury resort favored by celebrities with pristine beach and world-class amenities."
      },
      {
        id: "fairmont-royal-pavilion",
        name: "Fairmont Royal Pavilion",
        type: "standard",
        pricePerNight: 380,
        rating: 4.4,
        amenities: ["Beachfront", "Pool", "Tennis", "Water Sports", "Family Rooms"],
        kidFriendly: true,
        description: "All-inclusive beachfront resort with coral stone architecture."
      }
    ],
    flightData: {
      averageCost: 480,
      duration: "4-8h with connections",
      airlines: ["JetBlue", "American", "Caribbean Airlines"],
      directFlight: true
    }
  },

  {
    id: "jamaica-negril",
    name: "Negril, Jamaica",
    category: "budget",
    location: {
      country: "Jamaica",
      region: "Caribbean",
      coordinates: { lat: 18.2677, lng: -78.3488 }
    },
    seasonalPricing: {
      peak: 2800,
      shoulder: 2200,
      offSeason: 1800
    },
    kidFriendlyScore: 7.5,
    description: "Laid-back beach town with Seven Mile Beach, cliff diving, reggae culture, and affordable all-inclusive resorts. Pure Caribbean vibes.",
    activities: [
      {
        id: "seven-mile-beach",
        name: "Seven Mile Beach",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Famous white sand beach with crystal-clear water and beach bars."
      },
      {
        id: "ricks-cafe",
        name: "Rick's Café Cliff Jumping",
        type: "adventure",
        duration: 3,
        cost: 15,
        ageAppropriate: true,
        description: "Watch spectacular cliff diving and sunset at this iconic beach bar."
      },
      {
        id: "blue-hole-tour",
        name: "Blue Hole & River Tubing",
        type: "adventure",
        duration: 6,
        cost: 75,
        ageAppropriate: true,
        description: "Swim in natural blue pools and tube down tropical rivers."
      }
    ],
    hotels: [
      {
        id: "tensing-pen",
        name: "Tensing Pen",
        type: "luxury",
        pricePerNight: 420,
        rating: 4.6,
        amenities: ["Clifftop Location", "Natural Pools", "Yoga", "Organic Dining"],
        kidFriendly: false,
        description: "Boutique clifftop resort with natural rock pools and bohemian charm."
      },
      {
        id: "couples-negril",
        name: "Couples Negril",
        type: "standard",
        pricePerNight: 280,
        rating: 4.2,
        amenities: ["All-Inclusive", "Beach Access", "Multiple Pools", "Water Sports"],
        kidFriendly: false,
        description: "Adults-only all-inclusive resort on Seven Mile Beach."
      }
    ],
    flightData: {
      averageCost: 420,
      duration: "4-7h with connections",
      airlines: ["JetBlue", "Southwest", "American"],
      directFlight: true
    }
  },

  {
    id: "aruba",
    name: "Aruba",
    category: "family-friendly",
    location: {
      country: "Aruba",
      region: "Caribbean",
      coordinates: { lat: 12.5211, lng: -69.9683 }
    },
    seasonalPricing: {
      peak: 4200,
      shoulder: 3400,
      offSeason: 2800
    },
    kidFriendlyScore: 9.0,
    description: "One happy island with constant trade winds, no hurricane risk, stunning beaches, and family-friendly resorts. Perfect year-round destination.",
    activities: [
      {
        id: "eagle-beach",
        name: "Eagle Beach",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Consistently rated one of the world's best beaches with soft white sand."
      },
      {
        id: "butterfly-farm-aruba",
        name: "Butterfly Farm",
        type: "attraction",
        duration: 2,
        cost: 18,
        ageAppropriate: true,
        description: "Walk through tropical gardens filled with hundreds of exotic butterflies."
      },
      {
        id: "atv-tour-aruba",
        name: "ATV Desert Adventure",
        type: "adventure",
        duration: 4,
        cost: 95,
        ageAppropriate: true,
        description: "Explore Aruba's rugged landscape, natural pools, and desert terrain."
      }
    ],
    hotels: [
      {
        id: "ritz-carlton-aruba",
        name: "The Ritz-Carlton, Aruba",
        type: "luxury",
        pricePerNight: 850,
        rating: 4.7,
        amenities: ["Beach Club", "Spa", "Multiple Pools", "Kids Club", "Golf"],
        kidFriendly: true,
        description: "Luxury beachfront resort with exceptional family amenities and service."
      },
      {
        id: "holiday-inn-aruba",
        name: "Holiday Inn Resort Aruba",
        type: "standard",
        pricePerNight: 220,
        rating: 4.3,
        amenities: ["Beach Access", "Pool", "Kids Club", "Water Sports", "Family Rooms"],
        kidFriendly: true,
        description: "Family-friendly beachfront resort with extensive children's facilities."
      }
    ],
    flightData: {
      averageCost: 450,
      duration: "4-6h direct",
      airlines: ["JetBlue", "American", "United"],
      directFlight: true
    }
  },

  {
    id: "st-lucia",
    name: "St. Lucia",
    category: "luxury",
    location: {
      country: "Saint Lucia",
      region: "Caribbean",
      coordinates: { lat: 13.9094, lng: -60.9789 }
    },
    seasonalPricing: {
      peak: 5200,
      shoulder: 4000,
      offSeason: 3200
    },
    kidFriendlyScore: 7.0,
    description: "Dramatic volcanic island with iconic Piton mountains, luxury resorts, rainforest adventures, and romantic atmosphere. Paradise for couples.",
    activities: [
      {
        id: "pitons-hike",
        name: "Pitons Mountain Hike",
        type: "adventure",
        duration: 6,
        cost: 65,
        ageAppropriate: true,
        description: "Hike the iconic Gros Piton for breathtaking panoramic views."
      },
      {
        id: "sulphur-springs",
        name: "Sulphur Springs Drive-In Volcano",
        type: "attraction",
        duration: 3,
        cost: 25,
        ageAppropriate: true,
        description: "Visit the world's only drive-in volcano and therapeutic mud baths."
      },
      {
        id: "zip-lining-st-lucia",
        name: "Rainforest Zip Lining",
        type: "adventure",
        duration: 4,
        cost: 85,
        ageAppropriate: true,
        description: "Soar through the tropical rainforest canopy on thrilling zip lines."
      }
    ],
    hotels: [
      {
        id: "jade-mountain",
        name: "Jade Mountain",
        type: "luxury",
        pricePerNight: 1800,
        rating: 4.9,
        amenities: ["Infinity Pools", "Piton Views", "Open-Air Suites", "Spa", "Fine Dining"],
        kidFriendly: false,
        description: "Ultra-luxury resort with open-wall suites and infinity pools overlooking the Pitons."
      },
      {
        id: "sandals-grande-st-lucia",
        name: "Sandals Grande St. Lucian",
        type: "standard",
        pricePerNight: 450,
        rating: 4.4,
        amenities: ["All-Inclusive", "Multiple Beaches", "Golf Course", "Water Sports", "Spa"],
        kidFriendly: false,
        description: "Adults-only all-inclusive resort with championship golf course."
      }
    ],
    flightData: {
      averageCost: 520,
      duration: "5-8h with connections",
      airlines: ["JetBlue", "American", "Delta"],
      directFlight: true
    }
  },

  {
    id: "puerto-rico-san-juan",
    name: "San Juan, Puerto Rico",
    category: "cultural",
    location: {
      country: "United States",
      region: "Caribbean",
      coordinates: { lat: 18.4655, lng: -66.1057 }
    },
    seasonalPricing: {
      peak: 3200,
      shoulder: 2600,
      offSeason: 2200
    },
    kidFriendlyScore: 8.0,
    description: "Rich Spanish colonial history with colorful Old San Juan, El Yunque rainforest, bioluminescent bay, and no passport needed for US citizens.",
    activities: [
      {
        id: "old-san-juan",
        name: "Old San Juan Walking Tour",
        type: "cultural",
        duration: 4,
        cost: 20,
        ageAppropriate: true,
        description: "Explore 500-year-old cobblestone streets, colorful buildings, and historic forts."
      },
      {
        id: "el-yunque-rainforest",
        name: "El Yunque National Forest",
        type: "adventure",
        duration: 6,
        cost: 45,
        ageAppropriate: true,
        description: "Hike to waterfalls in the only tropical rainforest in the US National Forest system."
      },
      {
        id: "bioluminescent-bay",
        name: "Bioluminescent Bay Kayaking",
        type: "adventure",
        duration: 4,
        cost: 75,
        ageAppropriate: true,
        description: "Paddle through waters that glow with bioluminescent microorganisms."
      }
    ],
    hotels: [
      {
        id: "la-concha-resort",
        name: "La Concha Renaissance San Juan Resort",
        type: "luxury",
        pricePerNight: 380,
        rating: 4.5,
        amenities: ["Beachfront", "Multiple Pools", "Spa", "Restaurants", "Casino"],
        kidFriendly: true,
        description: "Iconic seashell-shaped hotel on Condado Beach with modern amenities."
      },
      {
        id: "hotel-el-convento",
        name: "Hotel El Convento",
        type: "standard",
        pricePerNight: 180,
        rating: 4.2,
        amenities: ["Historic Building", "Old San Juan Location", "Rooftop Bar", "Cultural Tours"],
        kidFriendly: true,
        description: "Historic 17th-century convent turned boutique hotel in Old San Juan."
      }
    ],
    flightData: {
      averageCost: 320,
      duration: "3-5h direct",
      airlines: ["JetBlue", "American", "Delta", "Southwest"],
      directFlight: true
    }
  },

  {
    id: "bahamas-nassau",
    name: "Nassau, Bahamas",
    category: "family-friendly",
    location: {
      country: "Bahamas",
      region: "Caribbean",
      coordinates: { lat: 25.0443, lng: -77.3504 }
    },
    seasonalPricing: {
      peak: 3800,
      shoulder: 3000,
      offSeason: 2400
    },
    kidFriendlyScore: 9.5,
    description: "Family paradise with Atlantis resort, swimming with dolphins, pristine beaches, and easy access from the US. Perfect for kids and adults.",
    activities: [
      {
        id: "atlantis-aquaventure",
        name: "Atlantis Aquaventure Waterpark",
        type: "attraction",
        duration: 8,
        cost: 150,
        ageAppropriate: true,
        description: "Massive water park with slides, lazy rivers, and marine exhibits."
      },
      {
        id: "swimming-with-dolphins",
        name: "Dolphin Encounter",
        type: "adventure",
        duration: 2,
        cost: 120,
        ageAppropriate: true,
        description: "Swim and interact with friendly dolphins in a lagoon setting."
      },
      {
        id: "cable-beach",
        name: "Cable Beach",
        type: "attraction",
        duration: 4,
        cost: 0,
        ageAppropriate: true,
        description: "Four miles of pristine white sand beach perfect for families."
      }
    ],
    hotels: [
      {
        id: "atlantis-paradise-island",
        name: "Atlantis Paradise Island",
        type: "luxury",
        pricePerNight: 650,
        rating: 4.3,
        amenities: ["Water Parks", "Aquariums", "Kids Club", "Multiple Pools", "Beach Access"],
        kidFriendly: true,
        description: "Massive resort complex with water parks, marine habitats, and endless family activities."
      },
      {
        id: "comfort-suites-paradise",
        name: "Comfort Suites Paradise Island",
        type: "standard",
        pricePerNight: 220,
        rating: 4.1,
        amenities: ["Atlantis Access", "Pool", "Family Suites", "Complimentary Breakfast"],
        kidFriendly: true,
        description: "All-suite hotel with access to Atlantis facilities at a fraction of the cost."
      }
    ],
    flightData: {
      averageCost: 280,
      duration: "2-4h direct",
      airlines: ["JetBlue", "American", "Delta", "Southwest"],
      directFlight: true
    }
  }
]