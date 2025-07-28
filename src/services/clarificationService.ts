/**
 * Clarification Service
 * Handles ambiguity detection and clarification question generation
 */

import { 
  ExtractedTravelInfo, 
  ConversationContext, 
  ClarificationQuestion, 
  ClarificationQuestionType,
  ContextModification,
  EnhancedConversationContext
} from "@/types/travel"
import { PersistentConversationContext } from "@/services/contextStorageService"

/**
 * DEPRECATED: This keyword-based analysis is no longer used
 * All analysis now happens via AI in aiAnalysisService.ts
 * Keeping this function only for potential fallback scenarios
 */
export function analyzeUserInput(input: string, conversationHistory: any[] = []): ConversationContext {
  const lowerInput = input.toLowerCase()
  
  // Extract destinations mentioned
  const destinations = extractDestinations(lowerInput)
  
  // Extract keywords that indicate preferences
  const keywords = extractKeywords(lowerInput)
  
  // Determine trip type hint
  const tripTypeHint = determineTripType(lowerInput, destinations)
  
  // Calculate ambiguity level
  const ambiguityLevel = calculateAmbiguityLevel(lowerInput, destinations, keywords)
  
  // Extract travel information
  const extractedInfo = extractTravelInfo(lowerInput)
  
  // Determine what information is missing
  const missingInfo = determineMissingInfo(extractedInfo, tripTypeHint)
  
  // Determine conversation stage
  const conversationStage = determineConversationStage(conversationHistory, ambiguityLevel)
  
  return {
    userIntent: {
      destinations,
      keywords,
      ambiguityLevel,
      tripTypeHint
    },
    extractedInfo,
    missingInfo,
    conversationStage
  }
}

/**
 * Extract mentioned destinations from user input
 */
function extractDestinations(input: string): string[] {
  const destinations: string[] = []
  
  // Major regions and countries
  const regions = [
    'europe', 'european', 'asia', 'asian', 'america', 'american', 'africa', 'african',
    'mediterranean', 'caribbean', 'pacific', 'scandinavia', 'scandinavian', 'balkans'
  ]
  
  // Major countries
  const countries = [
    'france', 'french', 'italy', 'italian', 'spain', 'spanish', 'germany', 'german',
    'uk', 'england', 'britain', 'british', 'ireland', 'japan', 'japanese', 'china', 'chinese',
    'thailand', 'vietnam', 'cambodia', 'india', 'greece', 'greek', 'portugal', 'portuguese',
    'netherlands', 'holland', 'switzerland', 'austria', 'czech', 'hungary', 'poland'
  ]
  
  // Major cities
  const cities = [
    'paris', 'rome', 'barcelona', 'madrid', 'london', 'berlin', 'amsterdam', 'prague',
    'budapest', 'vienna', 'tokyo', 'bangkok', 'singapore', 'hong kong', 'sydney',
    'new york', 'san francisco', 'los angeles', 'miami', 'chicago', 'las vegas'
  ]
  
  // Check for regions
  regions.forEach(region => {
    if (input.includes(region)) {
      destinations.push(region)
    }
  })
  
  // Check for countries
  countries.forEach(country => {
    if (input.includes(country)) {
      destinations.push(country)
    }
  })
  
  // Check for cities
  cities.forEach(city => {
    if (input.includes(city)) {
      destinations.push(city)
    }
  })
  
  return [...new Set(destinations)] // Remove duplicates
}

/**
 * Extract keywords that indicate travel preferences
 */
function extractKeywords(input: string): string[] {
  const keywords: string[] = []
  
  const keywordMap = {
    budget: ['budget', 'cheap', 'affordable', 'inexpensive', 'economical', 'save money'],
    luxury: ['luxury', 'luxurious', 'high-end', 'premium', 'expensive', 'splurge', 'five star'],
    family: ['family', 'kids', 'children', 'child-friendly', 'family-friendly'],
    food: ['food', 'culinary', 'cuisine', 'restaurant', 'dining', 'gastronomic', 'foodie'],
    culture: ['culture', 'cultural', 'history', 'historical', 'museum', 'art', 'heritage'],
    adventure: ['adventure', 'hiking', 'outdoor', 'active', 'sports', 'climbing', 'extreme'],
    beach: ['beach', 'beaches', 'seaside', 'coast', 'coastal', 'ocean', 'sea', 'tropical'],
    city: ['city', 'urban', 'metropolitan', 'downtown', 'nightlife', 'shopping'],
    nature: ['nature', 'natural', 'parks', 'wildlife', 'scenic', 'mountains', 'forests'],
    relaxation: ['relax', 'relaxing', 'peaceful', 'quiet', 'spa', 'wellness', 'retreat'],
    romantic: ['romantic', 'romance', 'honeymoon', 'couple', 'intimate'],
    solo: ['solo', 'alone', 'myself', 'independent', 'backpacking'],
    group: ['group', 'friends', 'together', 'party']
  }
  
  Object.entries(keywordMap).forEach(([category, terms]) => {
    if (terms.some(term => input.includes(term))) {
      keywords.push(category)
    }
  })
  
  return keywords
}

/**
 * Determine if user is asking for single or multi-destination trip
 */
function determineTripType(input: string, destinations: string[]): "single" | "multi-destination" | "unknown" {
  // Multi-destination indicators
  const multiKeywords = [
    'tour', 'multiple', 'several', 'various', 'different',
    'cities', 'countries', 'places', 'around', 'through',
    'circuit', 'journey', 'route', 'itinerary', 'across'
  ]
  
  // Single destination indicators
  const singleKeywords = [
    'visit', 'stay in', 'go to', 'spend time in', 'explore',
    'weekend in', 'week in', 'holiday in', 'stay', 'trip to'
  ]
  
  const hasMultiKeywords = multiKeywords.some(keyword => input.includes(keyword))
  const hasSingleKeywords = singleKeywords.some(keyword => input.includes(keyword))
  const multipleDestinations = destinations.length > 1
  
  // Clear multi-destination indicators
  if (hasMultiKeywords || multipleDestinations) {
    return "multi-destination"
  }
  
  // Clear single destination indicators OR single destination without multi keywords
  if (hasSingleKeywords || (destinations.length === 1 && !hasMultiKeywords)) {
    return "single"
  }
  
  return "unknown"
}

/**
 * Calculate how ambiguous the user's request is
 */
function calculateAmbiguityLevel(input: string, destinations: string[], keywords: string[]): "clear" | "somewhat_clear" | "unclear" {
  let clarityScore = 0
  
  // Points for specific information
  if (destinations.length > 0) clarityScore += 2
  if (keywords.length > 0) clarityScore += 1
  if (input.includes('$') || /\d+/.test(input)) clarityScore += 1 // Budget or numbers mentioned
  if (input.includes('day') || input.includes('week') || input.includes('month')) clarityScore += 1
  if (input.length > 50) clarityScore += 1 // Detailed description
  
  // Reduce points for vague language
  const vague = ['somewhere', 'anywhere', 'maybe', 'not sure', 'thinking about', 'ideas']
  if (vague.some(word => input.includes(word))) clarityScore -= 2
  
  if (clarityScore >= 4) return "clear"
  if (clarityScore >= 2) return "somewhat_clear"
  return "unclear"
}

/**
 * Extract specific travel information from user input
 */
function extractTravelInfo(input: string): ExtractedTravelInfo {
  const info: ExtractedTravelInfo = {}
  
  // Extract budget
  const budgetMatch = input.match(/\$(\d+(?:,\d+)?)/g)
  if (budgetMatch) {
    const amounts = budgetMatch.map(match => parseInt(match.replace(/[$,]/g, '')))
    info.budget = Math.max(...amounts) // Take the highest mentioned amount
  }
  
  // Extract duration
  const durationPatterns = [
    /(\d+)\s*days?/i,
    /(\d+)\s*weeks?/i,
    /(\d+)\s*months?/i
  ]
  
  for (const pattern of durationPatterns) {
    const match = input.match(pattern)
    if (match) {
      const number = parseInt(match[1] || "0")
      if (pattern.source.includes('week')) {
        info.duration = number * 7
      } else if (pattern.source.includes('month')) {
        info.duration = number * 30
      } else {
        info.duration = number
      }
      break
    }
  }
  
  // Extract traveler information
  if (input.includes('family') || input.includes('kids') || input.includes('children')) {
    info.travelers = { adults: 2, children: 1, ages: [8] } // Default family
  } else if (input.includes('couple') || input.includes('two of us')) {
    info.travelers = { adults: 2, children: 0 }
  } else if (input.includes('solo') || input.includes('myself') || input.includes('alone')) {
    info.travelers = { adults: 1, children: 0 }
  }
  
  // Extract date information
  const datePatterns = [
    /from\s+(\w+\s*\d+)\s+to\s+(\w+\s*\d+)/i, // "from sept 4 to sept 9"
    /(\w+\s*\d+)\s*-\s*(\w+\s*\d+)/i, // "sept 4 - sept 9"
    /(\d{1,2}\/\d{1,2}\/\d{2,4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i // "9/4/2024 - 9/9/2024"
  ]
  
  for (const pattern of datePatterns) {
    const match = input.match(pattern)
    if (match) {
      const startDate = match[1]?.trim()
      const endDate = match[2]?.trim()
      if (startDate && endDate) {
        info.dates = {
          startDate,
          endDate,
          flexibility: 'exact'
        }
      }
      break
    }
  }
  
  // Extract accommodation preferences
  if (input.includes('luxury') || input.includes('five star') || input.includes('premium')) {
    info.accommodationType = 'luxury'
  } else if (input.includes('budget') || input.includes('cheap') || input.includes('hostel')) {
    info.accommodationType = 'budget'
  } else {
    info.accommodationType = 'standard'
  }
  
  return info
}

/**
 * Determine what information is missing for a good recommendation
 */
function determineMissingInfo(extractedInfo: ExtractedTravelInfo, tripTypeHint: "single" | "multi-destination" | "unknown"): ClarificationQuestionType[] {
  const missing: ClarificationQuestionType[] = []
  
  if (tripTypeHint === "unknown") missing.push("trip_type")
  
  // Check for time information - either duration OR specific dates
  const hasTimeInfo = extractedInfo.duration || (extractedInfo.dates && (extractedInfo.dates.startDate || extractedInfo.dates.endDate))
  if (!hasTimeInfo) missing.push("duration")
  
  if (!extractedInfo.budget) missing.push("budget")
  if (!extractedInfo.travelers) missing.push("group_size")
  
  return missing
}

/**
 * Determine current stage of conversation
 */
function determineConversationStage(conversationHistory: any[], ambiguityLevel: "clear" | "somewhat_clear" | "unclear"): "initial" | "clarifying" | "planning" | "refining" {
  if (conversationHistory.length === 0) return "initial"
  if (ambiguityLevel === "unclear") return "clarifying"
  if (conversationHistory.length < 3) return "planning"
  return "refining"
}

/**
 * Generate clarification questions based on missing information
 */
export function generateClarificationQuestions(context: ConversationContext): ClarificationQuestion[] {
  const questions: ClarificationQuestion[] = []
  
  console.log('📋 Generating clarification questions. Missing info:', context.missingInfo)
  
  // Prioritize questions - most important first
  const priorityOrder: ClarificationQuestionType[] = ["trip_type", "duration", "budget", "group_size", "preferences"]
  
  // If no duration/dates/period detected, ensure we ask for it
  if (!context.extractedInfo.duration && !context.extractedInfo.dates && !context.extractedInfo.period) {
    if (!context.missingInfo.includes('duration')) {
      console.log('📋 Adding duration to missing info - no timing detected')
      context.missingInfo.push('duration')
    }
  }
  
  for (const type of priorityOrder) {
    if (context.missingInfo.includes(type)) {
      const question = createClarificationQuestion(type, context)
      if (question) questions.push(question)
      
      // Only ask 1-2 questions at a time to avoid overwhelming
      if (questions.length >= 2) break
    }
  }
  
  return questions
}

/**
 * Create a specific clarification question
 */
function createClarificationQuestion(type: ClarificationQuestionType, context: ConversationContext): ClarificationQuestion | null {
  const baseId = `clarify-${type}-${Date.now()}`
  
  switch (type) {
    case "trip_type":
      return {
        id: baseId,
        type,
        question: "Are you looking to explore multiple destinations, or would you prefer to focus deeply on one amazing place?",
        options: [
          { value: "single", label: "Focus on one destination", description: "Deep dive into one city or region" },
          { value: "multi", label: "Multi-destination tour", description: "Visit several places in one trip" },
          { value: "unsure", label: "I'm not sure", description: "Help me decide what would be best" }
        ],
        required: true,
        context: "This helps me understand the scope and style of trip you're envisioning."
      }
      
    case "duration":
      return {
        id: baseId,
        type,
        question: "How much time do you have for this adventure?",
        options: [
          { value: "3", label: "Weekend getaway", description: "2-4 days" },
          { value: "7", label: "Week-long trip", description: "5-9 days" },
          { value: "14", label: "Extended vacation", description: "10-16 days" },
          { value: "21", label: "Grand adventure", description: "3+ weeks" }
        ],
        required: true,
        context: "Duration helps me pace the itinerary and choose the right destinations."
      }
      
    case "budget":
      return {
        id: baseId,
        type,
        question: "What's your approximate budget for this trip? (per person, including flights)",
        options: [
          { value: "1000", label: "Budget-conscious", description: "Under $1,500" },
          { value: "3000", label: "Moderate budget", description: "$1,500 - $4,000" },
          { value: "6000", label: "Comfortable budget", description: "$4,000 - $8,000" },
          { value: "10000", label: "Luxury experience", description: "$8,000+" }
        ],
        required: true,
        context: "Budget helps me recommend appropriate accommodations, activities, and transportation."
      }
      
    case "group_size":
      return {
        id: baseId,
        type,
        question: "Who's joining you on this adventure?",
        options: [
          { value: "solo", label: "Just me", description: "Solo travel" },
          { value: "couple", label: "My partner and I", description: "Couple's trip" },
          { value: "family", label: "Family with kids", description: "Family-friendly options" },
          { value: "group", label: "Group of friends", description: "Group travel" }
        ],
        required: true,
        context: "Group composition helps me suggest appropriate activities and accommodations."
      }
      
    case "preferences":
      const userKeywords = context.userIntent.keywords
      const needsPreferences = userKeywords.length === 0
      
      if (needsPreferences) {
        return {
          id: baseId,
          type,
          question: "What draws you to travel? (Select all that interest you)",
          options: [
            { value: "food", label: "Culinary experiences", description: "Local cuisine, restaurants, food tours" },
            { value: "culture", label: "Culture & history", description: "Museums, historical sites, local traditions" },
            { value: "nature", label: "Nature & outdoors", description: "Scenic views, hiking, natural wonders" },
            { value: "city", label: "City experiences", description: "Urban exploration, nightlife, shopping" },
            { value: "relaxation", label: "Relaxation", description: "Beaches, spas, peaceful settings" }
          ],
          required: false,
          context: "Your interests help me curate experiences you'll love most."
        }
      }
      return null
      
    default:
      return null
  }
}

/**
 * DEPRECATED: This keyword-based info checking is no longer used
 * Use hasEnoughInfoForRecommendationsAI from aiAnalysisService.ts instead
 * Keeping this function only for potential fallback scenarios
 */
export function hasEnoughInfoForRecommendations(context: ConversationContext): boolean {
  const { extractedInfo, userIntent } = context
  
  // Debug logging
  console.log('🔍 hasEnoughInfoForRecommendations - Debug:', {
    destinations: userIntent.destinations,
    tripTypeHint: userIntent.tripTypeHint,
    duration: extractedInfo.duration,
    dates: extractedInfo.dates,
    budget: extractedInfo.budget,
    travelers: extractedInfo.travelers,
    keywords: userIntent.keywords
  })
  
  // Require more comprehensive information for good recommendations
  const hasTripType = userIntent.tripTypeHint !== "unknown"
  // Check for time information - either duration OR specific dates
  const hasTimeInfo = Boolean(extractedInfo.duration) || Boolean(extractedInfo.dates && (extractedInfo.dates.startDate || extractedInfo.dates.endDate))
  const hasBudget = Boolean(extractedInfo.budget)
  const hasGroupInfo = Boolean(extractedInfo.travelers)
  const hasDestinationHint = (userIntent.destinations && userIntent.destinations.length > 0) || userIntent.keywords.length > 0
  
  // Require destination, trip type, time info, and either budget OR group info
  const hasBasicInfo = hasDestinationHint && hasTripType && hasTimeInfo
  const hasFinancialOrGroupContext = hasBudget || hasGroupInfo
  
  console.log('🔍 hasEnoughInfoForRecommendations - Analysis:', {
    hasTripType,
    hasTimeInfo,
    hasBudget,
    hasGroupInfo,
    hasDestinationHint,
    hasBasicInfo,
    hasFinancialOrGroupContext,
    result: Boolean(hasBasicInfo && hasFinancialOrGroupContext)
  })
  
  return Boolean(hasBasicInfo && hasFinancialOrGroupContext)
}

/**
 * Update conversation context with user responses to clarification questions
 */
export function updateContextWithClarification(
  context: ConversationContext, 
  questionId: string, 
  answer: string
): ConversationContext {
  const updatedContext = { ...context }
  
  // Extract question type from ID
  const questionType = questionId.split('-')[1] as ClarificationQuestionType
  
  switch (questionType) {
    case "trip_type":
      updatedContext.userIntent.tripTypeHint = answer === "multi" ? "multi-destination" : "single"
      break
      
    case "duration":
      updatedContext.extractedInfo.duration = parseInt(answer)
      break
      
    case "budget":
      updatedContext.extractedInfo.budget = parseInt(answer)
      break
      
    case "group_size":
      if (answer === "solo") {
        updatedContext.extractedInfo.travelers = { adults: 1, children: 0 }
      } else if (answer === "couple") {
        updatedContext.extractedInfo.travelers = { adults: 2, children: 0 }
      } else if (answer === "family") {
        updatedContext.extractedInfo.travelers = { adults: 2, children: 1, ages: [8] }
      } else if (answer === "group") {
        updatedContext.extractedInfo.travelers = { adults: 4, children: 0 }
      }
      break
      
    case "preferences":
      if (!updatedContext.extractedInfo.preferences) {
        updatedContext.extractedInfo.preferences = []
      }
      updatedContext.extractedInfo.preferences.push(answer)
      break
  }
  
  // Remove the answered question from missing info
  updatedContext.missingInfo = updatedContext.missingInfo.filter(type => type !== questionType)
  
  // Update conversation stage
  if (updatedContext.missingInfo.length === 0) {
    updatedContext.conversationStage = "planning"
  }
  
  return updatedContext
}

/**
 * Merge new user input context with existing persistent context
 * This is the core function for maintaining conversation continuity
 */
export function mergeWithPersistentContext(
  newContext: ConversationContext,
  persistentContext: PersistentConversationContext,
  currentInput: string
): EnhancedConversationContext {
  // Start with the new context as base
  const mergedContext: EnhancedConversationContext = {
    ...newContext,
    sessionId: persistentContext.sessionId,
    messageCount: persistentContext.messageCount + 1,
    tokenUsage: persistentContext.tokenUsage,
    conversationSummary: persistentContext.conversationSummary,
    originalQuery: persistentContext.originalQuery,
    lastUpdated: new Date()
  }

  // Merge extracted information, preserving established facts
  mergedContext.extractedInfo = mergeExtractedInfo(
    newContext.extractedInfo,
    persistentContext.userPreferences,
    currentInput
  )

  // Update conversation stage based on accumulated context
  mergedContext.conversationStage = determineStageWithHistory(
    newContext.conversationStage,
    persistentContext.conversationStage,
    mergedContext.messageCount
  )

  // Update missing info based on merged context
  mergedContext.missingInfo = determineMissingInfo(
    mergedContext.extractedInfo, 
    mergedContext.userIntent.tripTypeHint || "unknown"
  )

  return mergedContext
}

/**
 * Merge extracted travel information with existing preferences
 * Detects modifications and maintains consistency
 */
function mergeExtractedInfo(
  newInfo: ExtractedTravelInfo,
  existingPreferences: ExtractedTravelInfo,
  currentInput: string
): ExtractedTravelInfo {
  const merged: ExtractedTravelInfo = { ...existingPreferences }

  // Budget: Allow updates if explicitly mentioned
  if (newInfo.budget && (isBudgetModification(currentInput) || !existingPreferences.budget)) {
    merged.budget = newInfo.budget
  }

  // Duration: Allow updates if explicitly mentioned
  if (newInfo.duration && (isDurationModification(currentInput) || !existingPreferences.duration)) {
    merged.duration = newInfo.duration
  }

  // Travelers: Allow updates if explicitly mentioned
  if (newInfo.travelers && (isTravelersModification(currentInput) || !existingPreferences.travelers)) {
    merged.travelers = newInfo.travelers
  }

  // Accommodation type: Allow updates if explicitly mentioned
  if (newInfo.accommodationType && (isAccommodationModification(currentInput) || !existingPreferences.accommodationType)) {
    merged.accommodationType = newInfo.accommodationType
  }

  // Preferences: Merge arrays, don't override completely
  if (newInfo.preferences && newInfo.preferences.length > 0) {
    const existingPrefs = existingPreferences.preferences || []
    merged.preferences = [...new Set([...existingPrefs, ...newInfo.preferences])]
  }

  // Trip type: Allow updates if explicitly mentioned
  if (newInfo.tripType && (isTripTypeModification(currentInput) || !existingPreferences.tripType)) {
    merged.tripType = newInfo.tripType
  }

  // Dates: Merge date information
  if (newInfo.dates) {
    merged.dates = {
      ...existingPreferences.dates,
      ...newInfo.dates
    }
  }

  // Regions: Merge region preferences
  if (newInfo.regions && newInfo.regions.length > 0) {
    const existingRegions = existingPreferences.regions || []
    merged.regions = [...new Set([...existingRegions, ...newInfo.regions])]
  }

  return merged
}

/**
 * Detect context modifications from user input
 */
export function detectContextModifications(
  currentInput: string,
  newContext: ConversationContext,
  existingContext?: ExtractedTravelInfo
): ContextModification[] {
  const modifications: ContextModification[] = []

  if (!existingContext) {
    return modifications // No existing context to compare against
  }

  // Check for budget modifications
  if (newContext.extractedInfo.budget && newContext.extractedInfo.budget !== existingContext.budget) {
    modifications.push({
      type: isBudgetIncrease(currentInput) ? 'refinement' : 'preference_update',
      field: 'budget',
      previousValue: existingContext.budget,
      newValue: newContext.extractedInfo.budget,
      confidence: isBudgetModification(currentInput) ? 0.9 : 0.6
    })
  }

  // Check for duration modifications
  if (newContext.extractedInfo.duration && newContext.extractedInfo.duration !== existingContext.duration) {
    modifications.push({
      type: 'refinement',
      field: 'duration',
      previousValue: existingContext.duration,
      newValue: newContext.extractedInfo.duration,
      confidence: isDurationModification(currentInput) ? 0.9 : 0.7
    })
  }

  // Check for accommodation type modifications
  if (newContext.extractedInfo.accommodationType && 
      newContext.extractedInfo.accommodationType !== existingContext.accommodationType) {
    modifications.push({
      type: 'preference_update',
      field: 'accommodationType',
      previousValue: existingContext.accommodationType,
      newValue: newContext.extractedInfo.accommodationType,
      confidence: isAccommodationModification(currentInput) ? 0.9 : 0.6
    })
  }

  // Check for new query patterns
  if (isNewQueryPattern(currentInput)) {
    modifications.push({
      type: 'variation_request',
      confidence: 0.8
    })
  }

  return modifications
}

/**
 * Helper functions for detecting specific modifications
 */
function isBudgetModification(input: string): boolean {
  const budgetModifiers = [
    'budget', 'cost', 'price', 'expensive', 'cheap', 'afford',
    'spend', 'save', 'splurge', 'increase', 'decrease', 'lower', 'higher'
  ]
  return budgetModifiers.some(modifier => input.toLowerCase().includes(modifier))
}

function isBudgetIncrease(input: string): boolean {
  const increaseWords = ['more', 'increase', 'higher', 'upgrade', 'better', 'splurge', 'luxury']
  return increaseWords.some(word => input.toLowerCase().includes(word))
}

function isDurationModification(input: string): boolean {
  const durationModifiers = [
    'day', 'week', 'month', 'longer', 'shorter', 'extend', 'reduce',
    'more time', 'less time', 'quick', 'extended'
  ]
  return durationModifiers.some(modifier => input.toLowerCase().includes(modifier))
}

function isTravelersModification(input: string): boolean {
  const travelerModifiers = [
    'solo', 'alone', 'couple', 'family', 'group', 'friends',
    'just me', 'with my', 'bringing', 'kids', 'children'
  ]
  return travelerModifiers.some(modifier => input.toLowerCase().includes(modifier))
}

function isAccommodationModification(input: string): boolean {
  const accommodationModifiers = [
    'hotel', 'luxury', 'budget', 'hostel', 'resort', 'standard',
    'upgrade', 'downgrade', 'cheaper', 'nicer', 'better'
  ]
  return accommodationModifiers.some(modifier => input.toLowerCase().includes(modifier))
}

function isTripTypeModification(input: string): boolean {
  const tripTypeModifiers = [
    'single', 'multi', 'multiple', 'one place', 'several places',
    'tour', 'focus on', 'explore different', 'stay in one'
  ]
  return tripTypeModifiers.some(modifier => input.toLowerCase().includes(modifier))
}

function isNewQueryPattern(input: string): boolean {
  const newQueryPatterns = [
    'instead', 'different', 'alternative', 'other options', 'something else',
    'what about', 'how about', 'maybe', 'could you show', 'any other'
  ]
  return newQueryPatterns.some(pattern => input.toLowerCase().includes(pattern))
}

/**
 * Determine conversation stage with historical context
 */
function determineStageWithHistory(
  newStage: ConversationContext['conversationStage'],
  existingStage: string,
  messageCount: number
): ConversationContext['conversationStage'] {
  // Don't regress stages unless explicitly starting over
  const stageProgression = ['initial', 'clarifying', 'planning', 'refining', 'completed']
  const currentIndex = stageProgression.indexOf(existingStage as any)
  const newIndex = stageProgression.indexOf(newStage)
  
  // Allow progression or stay at current stage
  if (messageCount > 10) return 'refining'
  if (messageCount > 5) return 'planning'
  if (newIndex > currentIndex) return newStage
  
  return existingStage as ConversationContext['conversationStage']
}

/**
 * DEPRECATED: This keyword-based context analysis is no longer used  
 * All analysis now happens via AI in aiAnalysisService.ts
 * Keeping this function only for potential fallback scenarios
 */
export function analyzeUserInputWithContext(
  input: string,
  conversationHistory: any[] = [],
  persistentContext?: PersistentConversationContext
): EnhancedConversationContext {
  // First, get base analysis
  const baseContext = analyzeUserInput(input, conversationHistory)
  
  // If we have persistent context, merge it
  if (persistentContext) {
    return mergeWithPersistentContext(baseContext, persistentContext, input)
  }
  
  // Otherwise, create enhanced context from base
  return {
    ...baseContext,
    messageCount: conversationHistory.length + 1,
    tokenUsage: 0,
    lastUpdated: new Date()
  }
}

/**
 * Generate context-aware clarification questions
 * Considers what we already know to avoid redundant questions
 */
export function generateContextAwareClarificationQuestions(
  context: EnhancedConversationContext,
  modifications: ContextModification[] = []
): ClarificationQuestion[] {
  // If user is making modifications, focus on those areas
  if (modifications.length > 0) {
    return generateModificationClarifications(context, modifications)
  }
  
  // Otherwise, use standard clarification logic
  return generateClarificationQuestions(context)
}

/**
 * Generate clarification questions specific to detected modifications
 */
function generateModificationClarifications(
  _context: EnhancedConversationContext,
  modifications: ContextModification[]
): ClarificationQuestion[] {
  const questions: ClarificationQuestion[] = []
  
  for (const modification of modifications) {
    if (modification.type === 'variation_request') {
      questions.push({
        id: `variation-${Date.now()}`,
        type: 'preferences',
        question: "I'd be happy to show you different options! What specifically would you like to see more of?",
        options: [
          { value: "budget", label: "More budget-friendly options", description: "Lower cost alternatives" },
          { value: "luxury", label: "More premium options", description: "Higher-end experiences" },
          { value: "different_style", label: "Different travel style", description: "Alternative activities or focus" },
          { value: "different_location", label: "Different destinations", description: "Other places to consider" }
        ],
        required: false,
        context: "This helps me understand what kind of variation you're looking for."
      })
      break // Only ask one variation question at a time
    }
  }
  
  return questions
}