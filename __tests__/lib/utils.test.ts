import { cn, formatPrice, formatDuration, truncateText } from '../../src/lib/utils'

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge simple class names', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const result = cn('px-4', true && 'py-2', false && 'bg-red-500', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('should merge conflicting Tailwind classes', () => {
      const result = cn('px-4 px-6', 'py-2 py-4')
      // twMerge should keep the last one of conflicting classes
      expect(result).toBe('px-6 py-4')
    })

    it('should handle undefined and null values', () => {
      const result = cn('px-4', null, undefined, 'py-2')
      expect(result).toBe('px-4 py-2')
    })

    it('should handle object syntax', () => {
      const result = cn({
        'px-4': true,
        'py-2': false,
        'bg-blue-500': true
      })
      expect(result).toBe('px-4 bg-blue-500')
    })

    it('should handle arrays', () => {
      const result = cn(['px-4', 'py-2'], 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })

  describe('formatPrice', () => {
    it('should format whole dollar amounts', () => {
      expect(formatPrice(100)).toBe('$100')
      expect(formatPrice(1500)).toBe('$1,500')
      expect(formatPrice(25000)).toBe('$25,000')
    })

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0')
    })

    it('should round decimal amounts', () => {
      expect(formatPrice(99.99)).toBe('$100')
      expect(formatPrice(149.50)).toBe('$150')
      expect(formatPrice(149.49)).toBe('$149')
    })

    it('should handle negative amounts', () => {
      expect(formatPrice(-100)).toBe('-$100')
    })

    it('should handle large numbers', () => {
      expect(formatPrice(1000000)).toBe('$1,000,000')
    })

    it('should handle decimal input', () => {
      expect(formatPrice(123.456)).toBe('$123')
    })
  })

  describe('formatDuration', () => {
    it('should format single day', () => {
      expect(formatDuration(1)).toBe('1 day')
    })

    it('should format multiple days less than a week', () => {
      expect(formatDuration(2)).toBe('2 days')
      expect(formatDuration(6)).toBe('6 days')
    })

    it('should format exactly one week', () => {
      expect(formatDuration(7)).toBe('1 week')
    })

    it('should format multiple whole weeks', () => {
      expect(formatDuration(14)).toBe('2 weeks')
      expect(formatDuration(21)).toBe('3 weeks')
    })

    it('should format weeks with remaining days', () => {
      expect(formatDuration(8)).toBe('1 week, 1 day')
      expect(formatDuration(9)).toBe('1 week, 2 days')
      expect(formatDuration(15)).toBe('2 weeks, 1 day')
      expect(formatDuration(16)).toBe('2 weeks, 2 days')
    })

    it('should handle zero days', () => {
      expect(formatDuration(0)).toBe('0 days')
    })

    it('should handle edge cases', () => {
      expect(formatDuration(365)).toBe('52 weeks, 1 day')
    })
  })

  describe('truncateText', () => {
    it('should not truncate text shorter than max length', () => {
      const text = 'Short text'
      expect(truncateText(text, 20)).toBe(text)
    })

    it('should not truncate text equal to max length', () => {
      const text = 'Exactly twenty chars'
      expect(truncateText(text, 20)).toBe(text)
    })

    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that needs to be truncated'
      const result = truncateText(text, 20)
      expect(result).toBe('This is a very long...')
      expect(result.length).toBe(22) // "This is a very long" (19 chars) + '...' (3 chars)
    })

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })

    it('should handle zero max length', () => {
      expect(truncateText('Hello', 0)).toBe('...')
    })

    it('should trim whitespace before adding ellipsis', () => {
      const text = 'Hello world with spaces   '
      const result = truncateText(text, 12)
      expect(result).toBe('Hello world...')
    })

    it('should handle single character', () => {
      expect(truncateText('A', 1)).toBe('A')
      expect(truncateText('AB', 1)).toBe('A...')
    })

    it('should handle text with only whitespace', () => {
      const text = '     '
      const result = truncateText(text, 3)
      expect(result).toBe('...')
    })

    it('should handle negative max length', () => {
      // With negative maxLength, slice(0, -1) removes last character  
      expect(truncateText('Hello', -1)).toBe('Hell...')
    })

    it('should preserve content before trimming', () => {
      const text = 'Hello world test'
      const result = truncateText(text, 11)
      expect(result).toBe('Hello world...')
    })
  })
})