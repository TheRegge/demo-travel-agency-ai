/**
 * Context Storage Service
 * Handles persistent storage of conversation context using localStorage
 * with error handling, privacy controls, and session management
 */

import { ConversationContext, ExtractedTravelInfo } from "@/types/travel"

// Storage keys
const STORAGE_KEYS = {
  CONVERSATION_CONTEXT: 'dreamvoyager_conversation_context',
  PRIVACY_SETTINGS: 'dreamvoyager_privacy_settings',
  SESSION_ID: 'dreamvoyager_session_id'
}

// Context expiration time (24 hours)
const CONTEXT_EXPIRY_MS = 24 * 60 * 60 * 1000

export interface PersistentConversationContext {
  sessionId: string
  lastUpdated: string // ISO string for JSON serialization
  userPreferences: ExtractedTravelInfo
  conversationSummary: string
  messageCount: number
  tokenUsage: number
  conversationStage: 'initial' | 'clarifying' | 'planning' | 'refining' | 'completed'
  originalQuery: string
  contextVersion: number // For future migration compatibility
}

export interface PrivacySettings {
  allowPersistence: boolean
  autoExpiry: boolean
  shareAnalytics: boolean
}

/**
 * Context Storage Service Class
 */
export class ContextStorageService {
  private isClient: boolean
  private privacySettings: PrivacySettings

  constructor() {
    this.isClient = typeof window !== 'undefined'
    this.privacySettings = this.loadPrivacySettings()
  }

  /**
   * Check if localStorage is available and user allows persistence
   */
  private isStorageAvailable(): boolean {
    if (!this.isClient || !this.privacySettings.allowPersistence) {
      return false
    }

    try {
      const testKey = '__test_storage__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (error) {
      console.warn('localStorage not available:', error)
      return false
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Load privacy settings from localStorage
   */
  private loadPrivacySettings(): PrivacySettings {
    const defaultSettings: PrivacySettings = {
      allowPersistence: true, // Default to true for demo purposes
      autoExpiry: true,
      shareAnalytics: false
    }

    if (!this.isClient) return defaultSettings

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS)
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch (error) {
      console.warn('Error loading privacy settings:', error)
      return defaultSettings
    }
  }

  /**
   * Save privacy settings
   */
  public savePrivacySettings(settings: Partial<PrivacySettings>): void {
    this.privacySettings = { ...this.privacySettings, ...settings }
    
    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(this.privacySettings))
      } catch (error) {
        console.warn('Error saving privacy settings:', error)
      }
    }
  }

  /**
   * Get current session ID or create new one
   */
  public getSessionId(): string {
    if (!this.isStorageAvailable()) {
      return this.generateSessionId()
    }

    try {
      let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID)
      if (!sessionId) {
        sessionId = this.generateSessionId()
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
      }
      return sessionId
    } catch (error) {
      console.warn('Error managing session ID:', error)
      return this.generateSessionId()
    }
  }

  /**
   * Save conversation context to localStorage
   */
  public saveContext(context: ConversationContext, additionalData: {
    messageCount: number
    tokenUsage: number
    conversationSummary?: string
    originalQuery?: string
  }): boolean {
    if (!this.isStorageAvailable()) {
      return false
    }

    try {
      const persistentContext: PersistentConversationContext = {
        sessionId: this.getSessionId(),
        lastUpdated: new Date().toISOString(),
        userPreferences: context.extractedInfo,
        conversationSummary: additionalData.conversationSummary || '',
        messageCount: additionalData.messageCount,
        tokenUsage: additionalData.tokenUsage,
        conversationStage: context.conversationStage,
        originalQuery: additionalData.originalQuery || '',
        contextVersion: 1
      }

      localStorage.setItem(STORAGE_KEYS.CONVERSATION_CONTEXT, JSON.stringify(persistentContext))
      return true
    } catch (error) {
      console.warn('Error saving conversation context:', error)
      return false
    }
  }

  /**
   * Load conversation context from localStorage
   */
  public loadContext(): PersistentConversationContext | null {
    if (!this.isStorageAvailable()) {
      return null
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATION_CONTEXT)
      if (!saved) return null

      const context: PersistentConversationContext = JSON.parse(saved)
      
      // Check if context has expired
      if (this.privacySettings.autoExpiry) {
        const lastUpdated = new Date(context.lastUpdated)
        if (Date.now() - lastUpdated.getTime() > CONTEXT_EXPIRY_MS) {
          this.clearContext()
          return null
        }
      }

      return context
    } catch (error) {
      console.warn('Error loading conversation context:', error)
      this.clearContext() // Clear corrupted data
      return null
    }
  }

  /**
   * Update specific context preferences
   */
  public updateContextPreferences(updates: Partial<ExtractedTravelInfo>): boolean {
    const existingContext = this.loadContext()
    if (!existingContext) return false

    try {
      const updatedContext: PersistentConversationContext = {
        ...existingContext,
        userPreferences: {
          ...existingContext.userPreferences,
          ...updates
        },
        lastUpdated: new Date().toISOString()
      }

      localStorage.setItem(STORAGE_KEYS.CONVERSATION_CONTEXT, JSON.stringify(updatedContext))
      return true
    } catch (error) {
      console.warn('Error updating context preferences:', error)
      return false
    }
  }

  /**
   * Clear conversation context
   */
  public clearContext(): void {
    if (!this.isClient) return

    try {
      localStorage.removeItem(STORAGE_KEYS.CONVERSATION_CONTEXT)
      localStorage.removeItem(STORAGE_KEYS.SESSION_ID)
    } catch (error) {
      console.warn('Error clearing context:', error)
    }
  }

  /**
   * Get context summary for display
   */
  public getContextSummary(): {
    hasContext: boolean
    preferences: string[]
    lastUpdated?: Date
    messageCount: number
  } {
    const context = this.loadContext()
    
    if (!context) {
      return {
        hasContext: false,
        preferences: [],
        messageCount: 0
      }
    }

    const preferences: string[] = []
    const prefs = context.userPreferences

    if (prefs.budget) {
      preferences.push(`Budget: $${prefs.budget.toLocaleString()}`)
    }
    if (prefs.duration) {
      preferences.push(`Duration: ${prefs.duration} days`)
    }
    if (prefs.travelers) {
      const travelers = prefs.travelers
      if (travelers.adults === 1) preferences.push('Solo traveler')
      else if (travelers.adults === 2 && travelers.children === 0) preferences.push('Couple')
      else if (travelers.children > 0) preferences.push('Family trip')
      else preferences.push(`Group of ${travelers.adults}`)
    }
    if (prefs.accommodationType) {
      preferences.push(`${prefs.accommodationType} accommodation`)
    }
    if (prefs.preferences && prefs.preferences.length > 0) {
      preferences.push(`Interests: ${prefs.preferences.join(', ')}`)
    }

    return {
      hasContext: true,
      preferences,
      lastUpdated: new Date(context.lastUpdated),
      messageCount: context.messageCount
    }
  }

  /**
   * Check if context storage is enabled
   */
  public isContextPersistenceEnabled(): boolean {
    return this.isStorageAvailable()
  }

  /**
   * Get storage usage statistics
   */
  public getStorageStats(): {
    isAvailable: boolean
    contextExists: boolean
    estimatedSize: number
    privacySettings: PrivacySettings
  } {
    const context = this.loadContext()
    const contextSize = context ? JSON.stringify(context).length : 0

    return {
      isAvailable: this.isStorageAvailable(),
      contextExists: context !== null,
      estimatedSize: contextSize,
      privacySettings: this.privacySettings
    }
  }

  /**
   * Create conversation context from persistent context
   */
  public toConversationContext(persistentContext: PersistentConversationContext): ConversationContext {
    return {
      userIntent: {
        destinations: [], // Will be populated from conversation history
        keywords: persistentContext.userPreferences.preferences || [],
        ambiguityLevel: 'clear' as const,
        tripTypeHint: 'unknown' as const // Will be determined from preferences
      },
      extractedInfo: persistentContext.userPreferences,
      missingInfo: [], // Will be recalculated
      conversationStage: persistentContext.conversationStage
    }
  }
}

// Export singleton instance
export const contextStorage = new ContextStorageService()

// Helper functions for easy usage
export const saveConversationContext = (context: ConversationContext, additionalData: {
  messageCount: number
  tokenUsage: number
  conversationSummary?: string
  originalQuery?: string
}) => contextStorage.saveContext(context, additionalData)

export const loadConversationContext = () => contextStorage.loadContext()

export const updateContextPreferences = (updates: Partial<ExtractedTravelInfo>) => 
  contextStorage.updateContextPreferences(updates)

export const clearConversationContext = () => contextStorage.clearContext()

export const getContextSummary = () => contextStorage.getContextSummary()

export const isContextPersistenceEnabled = () => contextStorage.isContextPersistenceEnabled()