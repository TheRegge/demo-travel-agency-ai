/**
 * API Route for conversation with Gemini AI
 * Handles server-side AI integration to keep API keys secure
 * Implements security checks and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { queryGeminiAI, validateGeminiSetup } from '@/lib/ai/gemini'
import { generateClarificationQuestions } from '@/services/clarificationService'
import { analyzeUserInputWithAI, hasEnoughInfoForRecommendationsAI } from '@/services/aiAnalysisService'
import { realDataService } from '@/services/realDataService'
import { securityService } from '@/services/securityService'
import { rateLimitService } from '@/services/rateLimitService'
import { apiUsageService } from '@/services/apiUsageService'

export async function POST(request: NextRequest) {
  try {
    // Check rate limits first
    const rateLimitStatus = await rateLimitService.checkRateLimit()
    if (!rateLimitStatus.allowed) {
      // Log rate limit event
      securityService.logSecurityEvent({
        type: 'rate_limit',
        severity: 'low',
        details: { reason: rateLimitStatus.reason }
      })
      
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: rateLimitStatus.reason === 'session_limit' 
            ? 'You have reached your daily conversation limit. Please try again tomorrow.'
            : rateLimitStatus.reason === 'token_limit'
            ? 'This conversation has reached its length limit. Please start a new conversation.'
            : 'Daily usage limit reached. Please try again tomorrow.',
          rateLimitInfo: {
            sessionsUsed: rateLimitStatus.sessionsUsed,
            sessionsRemaining: rateLimitStatus.sessionsRemaining,
            tokensUsed: rateLimitStatus.tokensUsed,
            tokensRemaining: rateLimitStatus.tokensRemaining,
            resetTime: rateLimitStatus.resetTime
          }
        },
        { 
          status: 429,
          headers: rateLimitService.getRateLimitHeaders(rateLimitStatus)
        }
      )
    }

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
    
    console.log('🔍 API received:', {
      input: body.input?.substring(0, 100) + (body.input?.length > 100 ? '...' : ''),
      inputLength: body.input?.length,
      hasHistory: !!body.conversationHistory,
      historyLength: body.conversationHistory?.length,
      hasContext: !!body.context
    })
    
    // Get client IP for security analysis
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Security validation and sanitization
    const securityCheck = await securityService.validateInput(body, clientIP, body.captchaToken)
    console.log('🔒 Security check result:', securityCheck)
    
    if (!securityCheck.isValid) {
      // Log security event
      securityService.logSecurityEvent({
        type: securityCheck.severity === 'high' ? 'prompt_injection' : 'validation_failure',
        severity: securityCheck.severity || 'low',
        details: { 
          error: securityCheck.error,
          patterns: securityCheck.detectedPatterns,
          requiresCaptcha: securityCheck.requiresCaptcha,
          suspiciousScore: securityCheck.suspiciousScore
        }
      })
      
      // Return CAPTCHA requirement if needed
      if (securityCheck.requiresCaptcha) {
        return NextResponse.json(
          { 
            success: false,
            error: 'CAPTCHA_REQUIRED',
            message: securityCheck.error || 'Please complete the security verification to continue.',
            requiresCaptcha: true
          },
          { status: 429 } // Too Many Requests
        )
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'INVALID_INPUT',
          message: securityCheck.error 
        },
        { status: 400 }
      )
    }
    
    // Get sanitized input
    const sanitized = securityService.sanitizeInput(body)
    console.log('🧹 Sanitized input result:', !!sanitized)
    
    if (!sanitized) {
      console.log('❌ Sanitization failed')
      return NextResponse.json(
        { 
          success: false,
          error: 'INVALID_INPUT',
          message: 'Invalid input provided' 
        },
        { status: 400 }
      )
    }
    
    const { input, conversationHistory: validHistory } = sanitized

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

    // Check if this is a non-travel question and handle accordingly
    const travelRelevance = currentContext?.travelRelevance || 'travel_related'
    if (travelRelevance === 'non_travel') {
      console.log('🚫 Non-travel question detected, redirecting user')
      
      const redirectionMessages = [
        "I'm here to help you find the perfect trip! ✈️ I specialize in travel planning and recommendations.",
        "I'm your travel planning assistant! 🌍 I'm here to help you discover amazing destinations and plan unforgettable trips.", 
        "Let me help you plan your next adventure! 🏖️ I can assist with destinations, budgets, activities, and everything travel-related."
      ]
      
      const randomMessage = redirectionMessages[Math.floor(Math.random() * redirectionMessages.length)]
      
      const suggestions = [
        "Where would you like to travel next?",
        "What's your dream destination?",
        "Are you planning a weekend getaway or a longer vacation?",
        "Tell me about your ideal trip - beach, mountains, city, or adventure?"
      ]
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      
      return NextResponse.json({
        success: true,
        message: `${randomMessage}\n\n${randomSuggestion}`,
        data: {
          recommendations: [],
          followUpQuestions: [
            "Plan a beach vacation",
            "Find weekend getaway ideas", 
            "Suggest budget-friendly destinations",
            "Help me plan a family trip"
          ]
        }
      })
    }
    
    // Handle travel-adjacent questions with gentle guidance
    if (travelRelevance === 'travel_adjacent') {
      console.log('🤔 Travel-adjacent question detected, providing gentle guidance')
      
      return NextResponse.json({
        success: true,
        message: "That's an interesting question! While I focus on travel planning, I'd love to help you turn that curiosity into your next adventure. Are you thinking about visiting there?",
        data: {
          recommendations: [],
          followUpQuestions: [
            "Plan a trip to explore this destination",
            "Find the best time to visit",
            "Suggest activities and attractions",
            "Help with travel logistics"
          ]
        }
      })
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

    // Estimate tokens for the request
    const estimatedTokens = Math.ceil(input.length / 4) + 
      validHistory.reduce((sum, msg) => sum + Math.ceil(msg.content.length / 4), 0)
    
    console.log('📊 Token calculation:', {
      inputLength: input.length,
      inputTokens: Math.ceil(input.length / 4),
      historyMessages: validHistory.length,
      historyTokens: validHistory.reduce((sum, msg) => sum + Math.ceil(msg.content.length / 4), 0),
      totalEstimated: estimatedTokens
    })
    
    // Get AI response
    const startTime = Date.now()
    let aiResponse
    try {
      aiResponse = await queryGeminiAI(input, validHistory)
      const responseTime = Date.now() - startTime
      apiUsageService.recordAPICall('gemini', responseTime, false, { 
        tokens: estimatedTokens 
      })
    } catch (error) {
      const responseTime = Date.now() - startTime
      apiUsageService.recordAPICall('gemini', responseTime, true)
      throw error
    }

    console.log('🤖 Full AI Response structure:', {
      hasRecommendations: !!aiResponse.recommendations,
      recommendations: aiResponse.recommendations,
      chatMessage: aiResponse.chatMessage?.substring(0, 100) + '...'
    })

    // Enhance trip recommendations with real data
    let enhancedTrips = aiResponse.recommendations?.trips || []
    console.log('🎯 AI Response trips:', enhancedTrips.length)
    
    if (enhancedTrips.length > 0) {
      try {
        console.log('🔄 Enhancing trips with real data...')
        console.log('🔄 Trip destinations:', enhancedTrips.map(t => t.destination))
        
        enhancedTrips = await realDataService.enhanceMultipleTrips(
          enhancedTrips,
          {
            includeWeather: true,
            includeAttractions: true,
            includeFlights: true,  // Enable real flight data
            includeHotels: true,   // Enable real hotel data  
            maxAttractions: 5
          }
        )
        console.log('✅ Enhanced trips with real data:', enhancedTrips.length)
      } catch (error) {
        console.warn('⚠️ Failed to enhance trips with real data, using mock data:', error)
        // Continue with mock data if enhancement fails
      }
    } else {
      console.log('⚠️ No trips to enhance - AI response had no recommendations')
    }

    // Record token usage for rate limiting (update with response tokens)
    const totalTokens = estimatedTokens + Math.ceil((aiResponse.chatMessage || '').length / 4)
    await rateLimitService.recordUsage(totalTokens, rateLimitStatus.currentSessionId)
    
    // Update API usage with final token count
    apiUsageService.recordAPICall('gemini', 0, false, { tokens: totalTokens })
    
    // Get updated rate limit status for response headers
    const finalRateLimitStatus = await rateLimitService.checkRateLimit()
    
    // Return structured response
    return NextResponse.json({
      success: true,
      message: aiResponse.chatMessage,
      data: {
        recommendations: enhancedTrips,
        followUpQuestions: aiResponse.followUpQuestions || []
      },
      conversationContext: currentContext, // Include context for debugging
      rateLimitInfo: {
        sessionsUsed: finalRateLimitStatus.sessionsUsed,
        sessionsRemaining: finalRateLimitStatus.sessionsRemaining,
        tokensUsed: finalRateLimitStatus.tokensUsed,
        tokensRemaining: finalRateLimitStatus.tokensRemaining,
        resetTime: finalRateLimitStatus.resetTime
      }
    }, {
      headers: rateLimitService.getRateLimitHeaders(finalRateLimitStatus)
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