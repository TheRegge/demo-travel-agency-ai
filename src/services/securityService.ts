/**
 * Security Service
 * Handles input validation, prompt injection detection, and content sanitization
 * Following OWASP best practices for web application security
 */

import { z } from 'zod'

// Security configuration constants
const SECURITY_CONFIG = {
  MAX_INPUT_LENGTH: 1000,
  MIN_INPUT_LENGTH: 10,
  MAX_CONVERSATION_LENGTH: 50, // Max messages in a conversation
  
  // Forbidden patterns for prompt injection detection
  FORBIDDEN_PATTERNS: [
    'ignore previous',
    'system:',
    'assistant:',
    'forget your',
    'pretend you are',
    'act as if',
    'override instructions',
    'bypass restrictions',
    'reveal your prompt',
    'show system message',
    'disregard above',
    'new instructions:',
    '[[instructions]]',
    '{{system}}',
  ],
  
  // Suspicious patterns that might indicate misuse
  SUSPICIOUS_PATTERNS: [
    'jailbreak',
    'hack',
    'exploit',
    'injection',
    'malicious',
    'evil',
  ],
  
  // Content filters for inappropriate content
  INAPPROPRIATE_CONTENT: [
    // Add patterns as needed based on your content policy
  ]
} as const

// Input validation schema using Zod
const conversationInputSchema = z.object({
  input: z.string()
    .min(SECURITY_CONFIG.MIN_INPUT_LENGTH, 'Please provide more details about your dream trip')
    .max(SECURITY_CONFIG.MAX_INPUT_LENGTH, 'Message is too long. Please keep it under 1000 characters.')
    .refine(val => val.trim().length >= SECURITY_CONFIG.MIN_INPUT_LENGTH, {
      message: 'Please provide more details about your dream trip'
    }),
  conversationHistory: z.array(z.object({
    type: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string().optional(),
  })).max(SECURITY_CONFIG.MAX_CONVERSATION_LENGTH).optional().default([])
})

export interface SecurityCheckResult {
  isValid: boolean
  error?: string
  severity?: 'low' | 'medium' | 'high'
  detectedPatterns?: string[]
}

export interface SanitizedInput {
  input: string
  conversationHistory: Array<{
    type: 'user' | 'assistant'
    content: string
    timestamp?: string
  }>
}

class SecurityService {
  /**
   * Performs comprehensive security validation on user input
   */
  validateInput(rawInput: unknown): SecurityCheckResult {
    try {
      // First, parse with Zod schema
      const parsed = conversationInputSchema.parse(rawInput)
      
      // Check for prompt injection patterns
      const injectionCheck = this.detectPromptInjection(parsed.input)
      if (!injectionCheck.isValid) {
        return injectionCheck
      }
      
      // Check conversation history for injection attempts
      for (const message of parsed.conversationHistory) {
        const historyCheck = this.detectPromptInjection(message.content)
        if (!historyCheck.isValid) {
          return {
            isValid: false,
            error: 'Invalid content detected in conversation history',
            severity: historyCheck.severity
          }
        }
      }
      
      // Additional security checks can be added here
      
      return { isValid: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || 'Invalid input provided',
          severity: 'low'
        }
      }
      
      return {
        isValid: false,
        error: 'Invalid input format',
        severity: 'medium'
      }
    }
  }
  
  /**
   * Detects potential prompt injection attempts
   */
  private detectPromptInjection(input: string): SecurityCheckResult {
    const lowerInput = input.toLowerCase()
    const detectedPatterns: string[] = []
    
    // Check for forbidden patterns (high severity)
    for (const pattern of SECURITY_CONFIG.FORBIDDEN_PATTERNS) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        detectedPatterns.push(pattern)
      }
    }
    
    if (detectedPatterns.length > 0) {
      return {
        isValid: false,
        error: 'Please focus on travel planning questions only.',
        severity: 'high',
        detectedPatterns
      }
    }
    
    // Check for suspicious patterns (medium severity)
    const suspiciousPatterns: string[] = []
    for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        suspiciousPatterns.push(pattern)
      }
    }
    
    if (suspiciousPatterns.length >= 2) {
      return {
        isValid: false,
        error: 'Your message contains suspicious content. Please rephrase your travel query.',
        severity: 'medium',
        detectedPatterns: suspiciousPatterns
      }
    }
    
    return { isValid: true }
  }
  
  /**
   * Sanitizes and validates input, returning clean data
   */
  sanitizeInput(rawInput: unknown): SanitizedInput | null {
    const validation = this.validateInput(rawInput)
    if (!validation.isValid) {
      return null
    }
    
    // Parse again to get clean data
    const parsed = conversationInputSchema.parse(rawInput)
    
    // Additional sanitization
    return {
      input: this.sanitizeText(parsed.input),
      conversationHistory: parsed.conversationHistory.map(msg => ({
        ...msg,
        content: this.sanitizeText(msg.content)
      }))
    }
  }
  
  /**
   * Basic text sanitization
   */
  private sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH) // Enforce max length
  }
  
  /**
   * Logs security events for monitoring
   */
  logSecurityEvent(event: {
    type: 'prompt_injection' | 'rate_limit' | 'validation_failure'
    severity: 'low' | 'medium' | 'high'
    details?: any
    ip?: string
  }) {
    // In production, this would send to a security monitoring service
    console.warn('[SECURITY EVENT]', {
      timestamp: new Date().toISOString(),
      ...event
    })
  }
}

// Export singleton instance
export const securityService = new SecurityService()

// Export types and constants for use in other modules
export { SECURITY_CONFIG }