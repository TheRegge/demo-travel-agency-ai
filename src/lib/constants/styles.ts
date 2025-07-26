/**
 * Style Constants
 * Centralized style definitions for consistent theming
 */

// Responsive Text Sizes
export const RESPONSIVE_TEXT = {
  xs: "text-xs sm:text-sm",
  sm: "text-sm sm:text-base",
  base: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl md:text-xl lg:text-2xl",
  xl: "text-xl sm:text-2xl md:text-3xl",
  "2xl": "text-2xl sm:text-3xl md:text-4xl",
  "3xl": "text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
} as const

// Common Gradients
export const GRADIENTS = {
  primary: "bg-gradient-to-r from-sky-500 to-emerald-500",
  primaryHover: "hover:from-sky-600 hover:to-emerald-600",
  logo: "bg-gradient-to-br from-sky-400 to-emerald-400",
  tripCover: "bg-gradient-to-br from-sky-400 via-emerald-400 to-amber-400",
  userBubble: "bg-sky-100/95",
  aiBubble: "bg-white/95"
} as const

// Animation Durations
export const ANIMATIONS = {
  fast: "transition-all duration-200",
  normal: "transition-all duration-300",
  slow: "transition-all duration-500"
} as const

// Component Spacing
export const COMPONENT_SPACING = {
  containerPadding: "px-3 sm:px-4 md:px-6",
  chatPadding: "p-4 sm:p-5 md:p-6",
  cardPadding: "p-3 sm:p-4"
} as const

// Shadow Definitions
export const SHADOWS = {
  card: "shadow-lg",
  cardHover: "hover:shadow-xl",
  cardElevated: "shadow-xl hover:shadow-2xl"
} as const

// Border Radius
export const RADIUS = {
  chat: "rounded-2xl",
  button: "rounded-full",
  card: "rounded-2xl",
  input: "rounded-2xl"
} as const