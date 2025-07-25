// App Configuration
export const APP_CONFIG = {
  name: "DreamVoyager Travel",
  description: "AI-powered travel planning assistant",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const

// Rate Limiting Configuration
export const RATE_LIMITS = {
  sessionsPerDay: 5,
  tokensPerSession: 2500,
  resetWindow: "24h",
  dailySpendCap: 5, // USD
} as const

// AI Configuration
export const AI_CONFIG = {
  model: "gemini-2.0-flash-exp",
  maxTokens: 1000,
  temperature: 0.7,
} as const

// Budget Tiers
export const BUDGET_TIERS = {
  ultraBudget: { min: 0, max: 200 },
  lowBudget: { min: 200, max: 800 },
  moderateBudget: { min: 800, max: 2500 },
  highBudget: { min: 2500, max: Infinity },
} as const

// Animation Durations (in seconds)
export const ANIMATION_DURATIONS = {
  cloudDrift: 25,
  palmSway: 5,
  waveMotion: 3,
  buttonPress: 0.2,
} as const

// Tropical Theme Colors (CSS custom properties)
export const THEME_COLORS = {
  // Sky & Ocean Blues
  skyLight: "#E0F2FE",
  skyMedium: "#7DD3FC", 
  oceanBlue: "#0EA5E9",
  deepBlue: "#0284C7",
  
  // Warm Sunset Colors
  sunsetOrange: "#FB923C",
  sunsetPink: "#F472B6",
  warmYellow: "#FBBF24",
  
  // Nature Greens
  palmGreen: "#34D399",
  grassGreen: "#10B981",
  
  // Sand & Neutrals
  sandLight: "#FEF3C7",
  sandMedium: "#F59E0B",
  cloudWhite: "#FFFFFF",
  softGray: "#6B7280",
} as const