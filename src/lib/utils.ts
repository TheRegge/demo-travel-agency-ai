import { type ClassValue, clsx } from "clsx"

/**
 * Utility function to merge class names with clsx
 * Commonly used pattern in shadcn/ui components
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format price in USD
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format duration for display
 */
export function formatDuration(days: number): string {
  if (days === 1) return "1 day"
  if (days < 7) return `${days} days`
  
  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7
  
  if (weeks === 1 && remainingDays === 0) return "1 week"
  if (remainingDays === 0) return `${weeks} weeks`
  if (weeks === 1) return `1 week, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
  
  return `${weeks} weeks, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}