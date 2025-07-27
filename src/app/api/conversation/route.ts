/**
 * API Route for conversation with Gemini AI
 * Handles server-side AI integration to keep API keys secure
 */

import { NextRequest, NextResponse } from 'next/server'
import { queryGeminiAI, validateGeminiSetup } from '@/lib/ai/gemini'

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
    const { input, conversationHistory = [] } = body

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

    // Get AI response
    const aiResponse = await queryGeminiAI(input, validHistory)

    // Return structured response
    return NextResponse.json({
      success: true,
      message: aiResponse.chatMessage,
      data: {
        recommendations: aiResponse.recommendations.trips,
        followUpQuestions: aiResponse.followUpQuestions || []
      }
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