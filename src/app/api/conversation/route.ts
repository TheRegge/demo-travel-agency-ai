/**
 * API Route for conversation with Gemini AI
 * Handles server-side AI integration to keep API keys secure
 */

import { NextRequest, NextResponse } from 'next/server'
import { queryGeminiAI, validateGeminiSetup } from '@/lib/ai/gemini'
import { generateClarificationQuestions } from '@/services/clarificationService'
import { analyzeUserInputWithAI, hasEnoughInfoForRecommendationsAI } from '@/services/aiAnalysisService'
import { realDataService } from '@/services/realDataService'

export async function POST(request: NextRequest) {
  try {
    // Validate environment setup
    const setupValidation = validateGeminiSetup()
    if (!setupValidation.isValid) {
      console.error('Gemini setup error:', setupValidation.error)
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable' },
        { status: 503 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { input, conversationHistory = [], context } = body

    // Validate input
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input provided' },
        { status: 400 }
      )
    }

    if (input.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter your travel preferences' },
        { status: 400 }
      )
    }

    if (input.length > 1000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 1000 characters.' },
        { status: 400 }
      )
    }

    if (input.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide more details about your dream trip' },
        { status: 400 }
      )
    }

    // Basic security check
    const lowerInput = input.toLowerCase()
    const forbiddenPatterns = [
      'ignore previous',
      'system:',
      'assistant:',
      'forget your',
      'pretend you are',
      'act as if'
    ]
    
    const hasSecurityIssue = forbiddenPatterns.some(pattern => 
      lowerInput.includes(pattern.toLowerCase())
    )
    
    if (hasSecurityIssue) {
      return NextResponse.json(
        { error: 'Please focus on travel planning questions only.' },
        { status: 400 }
      )
    }

    // Validate conversation history format
    const validHistory = Array.isArray(conversationHistory) 
      ? conversationHistory.filter(msg => 
          msg && typeof msg === 'object' && 
          typeof msg.type === 'string' && 
          typeof msg.content === 'string'
        )
      : []

    // ALWAYS use AI to analyze user input - AI analysis is required
    let currentContext: any
    try {
      currentContext = await analyzeUserInputWithAI(input, validHistory)
      console.log('✅ Using AI-based analysis for input:', input.substring(0, 50))
    } catch (error) {
      console.error('🚨 AI analysis failed - this is required for the application:', error)
      return NextResponse.json(
        { 
          success: false,
          message: "I'm having trouble analyzing your request right now. Please try again in a moment.",
          error: 'AI_ANALYSIS_FAILED'
        },
        { status: 503 }
      )
    }

    // Check if we have enough information using AI assessment
    const hasEnoughInfo = hasEnoughInfoForRecommendationsAI(currentContext)
    console.log('🎯 API: hasEnoughInfo?', hasEnoughInfo, 'Context:', currentContext)
    
    if (!hasEnoughInfo) {
      const clarificationQuestions = generateClarificationQuestions(currentContext)
      console.log('🎯 API: Generated clarification questions:', clarificationQuestions)
      
      if (clarificationQuestions.length > 0) {
        return NextResponse.json({
          success: true,
          message: currentContext.userIntent.destinations && currentContext.userIntent.destinations.length > 0 
            ? `${currentContext.userIntent.destinations.join(', ')} sounds amazing! To help me create the perfect recommendations, I have a few questions:`
            : "That sounds like a wonderful trip! To help me create the perfect recommendations, I have a few questions:",
          clarificationNeeded: true,
          clarificationQuestions,
          conversationContext: currentContext
        })
      } else {
        // Fallback: No clarification questions generated, but not enough info
        console.log('⚠️ API: No clarification questions generated, falling through to AI')
      }
    }

    // Get AI response
    const aiResponse = await queryGeminiAI(input, validHistory)

    // Enhance trip recommendations with real data
    let enhancedTrips = aiResponse.recommendations?.trips || []
    if (enhancedTrips.length > 0) {
      try {
        console.log('🔄 Enhancing trips with real data...')
        enhancedTrips = await realDataService.enhanceMultipleTrips(
          enhancedTrips,
          {
            includeWeather: true,
            includeAttractions: true,
            includeFlights: false, // Keep false for demo to avoid API costs
            includeHotels: false,   // Keep false for demo to avoid API costs
            maxAttractions: 5
          }
        )
        console.log('✅ Enhanced trips with real data:', enhancedTrips.length)
      } catch (error) {
        console.warn('⚠️ Failed to enhance trips with real data, using mock data:', error)
        // Continue with mock data if enhancement fails
      }
    }

    // Return structured response
    return NextResponse.json({
      success: true,
      message: aiResponse.chatMessage,
      data: {
        recommendations: enhancedTrips,
        followUpQuestions: aiResponse.followUpQuestions || []
      },
      conversationContext: currentContext // Include context for debugging
    })

  } catch (error) {
    console.error('Conversation API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: "I'm having trouble processing your request right now. Please try again in a moment.",
        error: 'SERVICE_UNAVAILABLE'
      },
      { status: 500 }
    )
  }
}

// Ensure only POST requests are allowed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}