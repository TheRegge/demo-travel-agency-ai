/**
 * Layout Constants
 * Centralized layout definitions for consistent spacing and positioning
 */

// Z-Index Layers
export const Z_INDEX = {
  background: 0,
  gradientOverlay: 10,
  content: 20,
  header: 40,
  chat: 50,
  modal: 100,
  tooltip: 200
} as const

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
} as const

// Container Constraints
export const CONTAINERS = {
  maxWidth: "max-w-4xl",
  chatWidth: "max-w-[85%] sm:max-w-[80%] md:max-w-[70%]",
  fullWidth: "w-full"
} as const

// Responsive Spacing
export const SPACING = {
  containerPadding: "px-3 sm:px-4 md:px-6",
  chatPadding: "p-4 sm:p-5 md:p-6",
  cardPadding: "p-3 sm:p-4",
  bottomOffset: "bottom-[200px] md:bottom-[280px]",
  inputBottomOffset: "bottom-0"
} as const

// Scroll Buffer Values
export const SCROLL_BUFFERS = {
  mobile: 250,
  desktop: 100
} as const

// Timing Constants
export const TIMING = {
  autoScrollDelay: 100,
  animationDuration: 300,
  debounceDelay: 300
} as const