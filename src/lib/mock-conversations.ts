// Mock conversation examples showcasing different travel planning scenarios
// These demonstrate the AI assistant's capabilities and response patterns

export const mockConversations = {
  familyTrip: [
    {
      id: "family-1",
      content: "Hi! I'm planning a family vacation to Orlando with my wife and 2 kids (ages 8 and 12). Our budget is around $3,000. Can you help me plan something amazing?",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: "family-2", 
      content: "Absolutely! Orlando is perfect for families with kids those ages. With a $3,000 budget, I can create an incredible 4-day experience focusing on the most kid-friendly attractions while keeping costs manageable.\n\n🎢 **Orlando Family Adventure (4 Days)**\n\n**Day 1-2: Walt Disney World Magic Kingdom**\n- Priority attractions: Space Mountain, Pirates of the Caribbean, Haunted Mansion\n- Character dining at Chef Mickey's (kids will love this!)\n- Budget-friendly stay: Disney's Pop Century Resort\n\n**Day 3: Universal Studios** \n- Harry Potter World (perfect for your 12-year-old)\n- Simpsons Ride, Transformers 3D\n- Express passes recommended for shorter lines\n\n**Day 4: ICON Park & City Walk**\n- Orlando Eye observation wheel\n- Madame Tussauds (great for photos)\n- Shopping and casual dining\n\n**Budget Breakdown:**\n- Accommodations (4 nights): $800\n- Park tickets (family of 4): $1,200\n- Meals & snacks: $600\n- Transportation & misc: $400\n- **Total: $3,000**\n\nWould you like me to adjust anything or focus on specific attractions your kids are most excited about?",
      sender: "assistant" as const,
      timestamp: new Date(Date.now() - 4 * 60 * 1000) // 4 minutes ago
    },
    {
      id: "family-3",
      content: "This looks amazing! My 12-year-old is obsessed with Harry Potter. Can we spend more time at Universal and maybe less at Disney?",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    },
    {
      id: "family-4",
      content: "Perfect! A Harry Potter fan - let's make this trip magical! 🪄\n\n**Updated Orlando Plan (Harry Potter Focus):**\n\n**Day 1: Disney Magic Kingdom** (1 day only)\n- Must-do classics for your 8-year-old\n- Early park hours strategy\n\n**Day 2-3: Universal Studios & Islands of Adventure**\n- **Full Harry Potter Experience**: Both Diagon Alley and Hogsmeade\n- Hogwarts Express ride between parks\n- Interactive wands at Ollivanders\n- Butterbeer tasting (try all 3 varieties!)\n- Harry Potter escape room experience\n\n**Day 4: Universal CityWalk & Hotel Pool Day**\n- Recovery day with hotel amenities\n- Shopping for Harry Potter merchandise\n- Mini golf and entertainment\n\n**Budget remains $3,000** with better Universal hotel package!\n\nShould I book the Harry Potter themed hotel room at Universal's Cabana Bay? It's within budget and your 12-year-old will absolutely love waking up in a wizarding world!",
      sender: "assistant" as const,
      timestamp: new Date(Date.now() - 30 * 1000) // 30 seconds ago
    }
  ],

  budgetEurope: [
    {
      id: "budget-1",
      content: "I'm a recent college grad with only $1,500 to spend. Show me the best European destinations I can afford for a solo trip!",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: "budget-2",
      content: "Congratulations on graduating! $1,500 can actually go quite far in Europe if you're strategic. Here are my top budget-friendly recommendations:\n\n🏰 **Prague, Czech Republic (7 days) - $1,200 total**\n- Flights: $400-500\n- Hostels: $20/night ($140 total)\n- Food: $25/day ($175 total)\n- Attractions & transport: $200\n- Prague Castle, Charles Bridge, cheap excellent beer!\n\n🇭🇺 **Budapest, Hungary (7 days) - $1,100 total**\n- Even cheaper than Prague\n- Thermal baths, Danube cruises\n- Incredible nightlife scene\n- Hungarian cuisine for under $10/meal\n\n🇵🇱 **Krakow, Poland (10 days) - $1,300 total**\n- Your dollar goes furthest here\n- Rich history, stunning architecture\n- Day trip to Auschwitz-Birkenau\n- Pierogi and vodka for incredibly cheap\n\n**Pro Budget Tips:**\n- Travel in shoulder season (April-May, Sept-Oct)\n- Use Ryanair/EasyJet for cheap flights\n- Stay in hostels with kitchens\n- Take advantage of free walking tours\n\nWhich destination appeals to you most? I can create a detailed daily itinerary!",
      sender: "assistant" as const,
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: "budget-3",
      content: "Prague sounds incredible! Can you give me that detailed itinerary with specific recommendations for a 22-year-old who loves history and good beer?",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: "budget-4",
      content: "Perfect choice! Prague is going to blow your mind. Here's your complete 7-day itinerary:\n\n🍺 **PRAGUE ADVENTURE FOR A HISTORY-LOVING BEER ENTHUSIAST**\n\n**Day 1: Arrival & Old Town**\n- Check into Hostel One Home (€18/night, great social scene)\n- Free Old Town walking tour (3pm start)\n- Evening: U Fleků brewery (oldest in Prague, since 1499!)\n- Budget: €35\n\n**Day 2: Prague Castle & Lesser Town** \n- Early morning castle visit (avoid crowds)\n- St. Vitus Cathedral - incredible Gothic architecture\n- Lunch: Traditional goulash at Lokal (€8)\n- Afternoon: Kampa Island park along the river\n- Budget: €30\n\n**Day 3: Jewish Quarter & Beer Culture**\n- Jewish Museum & synagogues (€13 student discount)\n- Lunch: Jewish Quarter street food\n- Pilsner Urquell Brewery tour & tasting\n- Evening: Beer garden at Riegrovy sady\n- Budget: €40\n\n**Day 4: Day Trip - Český Krumlov**\n- UNESCO World Heritage medieval town\n- Train: €15 round trip\n- Castle tour and river rafting option\n- Medieval tavern dinner\n- Budget: €50\n\n**Day 5: Communism History & Modern Prague**\n- Communism Museum (€9)\n- Wenceslas Square historical walk\n- Lunch: Vietnamese pho in New Town (€5)\n- Evening: Craft beer tasting tour\n- Budget: €35\n\n**Day 6: Vyšehrad & River Activities**\n- Vyšehrad fortress and cemetery\n- Afternoon: Paddle boat on Vltava River\n- Sunset from Charles Bridge\n- Farewell dinner: Traditional Czech restaurant\n- Budget: €45\n\n**Day 7: Last-minute Shopping & Departure**\n- Souvenir shopping at Havelské Tržiště market\n- Final Czech breakfast\n- Airport departure\n- Budget: €25\n\n**Total Trip Cost: €1,180**\n- Flights: €450\n- Accommodation: €126 (7 nights)\n- Food & drinks: €350\n- Activities & transport: €254\n\n**Remaining €320 for emergencies and extra beer!** 🍻\n\nWant me to book any of these recommendations or adjust the itinerary?",
      sender: "assistant" as const,
      timestamp: new Date(Date.now() - 1 * 60 * 1000)
    }
  ],

  adventureTravel: [
    {
      id: "adventure-1",
      content: "Looking for an epic adventure trip to Iceland. I love hiking, photography, and have about $4,000 to spend. What's the most incredible experience you can plan?",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: "adventure-2",
      content: "Iceland is absolutely perfect for adventure and photography! With $4,000, I can plan an unforgettable 8-day Ring Road adventure:\n\n🏔️ **ICELAND RING ROAD ADVENTURE**\n\n**Photography & Adventure Highlights:**\n- Northern Lights season (Sept-March) OR Midnight Sun (June-July)\n- Drone photography at black sand beaches\n- Ice cave exploration in Vatnajökull\n- Highland hot springs only locals know\n\n**Day 1-2: Reykjavik & Golden Circle**\n- Blue Lagoon geothermal spa\n- Geysir hot springs & Gullfoss waterfall\n- Photography workshop with local pro\n\n**Day 3-4: South Coast Epic**\n- Seljalandsfoss & Skógafoss waterfalls\n- Black sand beaches of Reynisfjara\n- Glacier hiking on Sólheimajökull\n- Diamond Beach icebergs (Instagram gold!)\n\n**Day 5-6: East Fjords & Highlands**\n- Stokksnes Peninsula (most dramatic coastline)\n- Highland F-roads adventure (4WD rental)\n- Wild camping under northern lights\n\n**Day 7-8: North Iceland & Return**\n- Dettifoss waterfall (most powerful in Europe)\n- Mývatn geothermal area\n- Húsavík whale watching\n\n**Budget Breakdown:**\n- Flights: $800\n- 4WD car rental (8 days): $1,200\n- Accommodation mix (hotels/camping): $800\n- Food & activities: $600\n- Photography gear rental: $300\n- Emergency fund: $300\n\n**Total: $4,000**\n\nBest time to visit for your interests? Northern Lights or Midnight Sun photography?",
      sender: "assistant" as const,
      timestamp: new Date(Date.now() - 6 * 60 * 1000)
    }
  ],

  quickHelp: [
    {
      id: "quick-1",
      content: "Need a quick weekend getaway from NYC, under $500 total",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 3 * 60 * 1000)
    },
    {
      id: "quick-2",
      content: "Perfect! Here are 3 amazing weekend options from NYC under $500:\n\n🍁 **Hudson Valley, NY (2 days)**\n- Train to Cold Spring: $30\n- B&B accommodation: $150/night\n- Hiking, antiquing, farm-to-table dining\n- Total: $380\n\n🏖️ **Cape May, NJ (2 days)**\n- Drive or bus: $50\n- Victorian B&B: $120/night  \n- Beach, boardwalk, wine tasting\n- Total: $340\n\n🏛️ **Philadelphia, PA (2 days)**\n- Amtrak train: $80\n- Center City hotel: $130/night\n- History tours, cheesesteaks, museums\n- Total: $450\n\nWhich vibe matches your mood? Nature, beach, or city exploration?",
      sender: "assistant" as const,
      timestamp: new Date(Date.now() - 1 * 60 * 1000)
    }
  ]
}

export type ConversationType = keyof typeof mockConversations