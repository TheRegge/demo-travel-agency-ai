/**
 * Next.js Middleware for Bot Detection and Security
 * Runs on every request to detect and block malicious bots
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Known bot user agents to block
const BLOCKED_USER_AGENTS = [
  // Generic bots and scrapers
  'curl',
  'wget',
  'python-requests',
  'httpclient',
  'apache-httpclient',
  'okhttp',
  'node-fetch',
  'axios',
  'http',
  'bot',
  'crawler',
  'spider',
  'scraper',
  'headless',
  'phantom',
  'selenium',
  'webdriver',
  'puppeteer',
  'playwright',
  
  // Specific problematic bots
  'mj12bot',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'blexbot',
  'sistrix',
  'linkdexbot',
  'exabot',
  'facebookexternalhit',
  'twitterbot',
  'slackbot',
  'whatsapp',
  'telegrambot',
  'discordbot',
  
  // AI training bots
  'chatgpt-user',
  'gpt-3',
  'openai',
  'anthropic',
  'claude',
  'bard',
  'gemini'
]

// Allowed legitimate crawlers (with rate limiting)
const ALLOWED_CRAWLERS = [
  'googlebot',
  'bingbot',
  'slurp', // Yahoo
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookcatalog', // Meta catalog crawler
  'linkedinbot', // LinkedIn preview
  'pinterestbot', // Pinterest preview
  'applebot' // Apple Siri/Spotlight
]

// Suspicious patterns in requests
const SUSPICIOUS_PATTERNS = [
  '/admin',
  '/login',
  '/wp-admin',
  '/phpmyadmin',
  '.env',
  '.git',
  'config.php',
  'database.sql',
  'backup',
  '/test',
  '/debug',
  '/.well-known'
]

/**
 * Analyzes user agent to determine if it's a bot
 */
function analyzeUserAgent(userAgent: string | null): {
  isBot: boolean
  isAllowedCrawler: boolean
  botType?: string
} {
  if (!userAgent) {
    return { isBot: true, isAllowedCrawler: false, botType: 'no-user-agent' }
  }

  const lowerUA = userAgent.toLowerCase()

  // Check for allowed crawlers first
  for (const crawler of ALLOWED_CRAWLERS) {
    if (lowerUA.includes(crawler)) {
      return { isBot: true, isAllowedCrawler: true, botType: crawler }
    }
  }

  // Check for blocked user agents
  for (const blockedAgent of BLOCKED_USER_AGENTS) {
    if (lowerUA.includes(blockedAgent)) {
      return { isBot: true, isAllowedCrawler: false, botType: blockedAgent }
    }
  }

  // Additional heuristics for bot detection
  const botIndicators = [
    lowerUA.length < 10, // Very short user agents
    lowerUA.length > 500, // Suspiciously long user agents
    !lowerUA.includes('mozilla'), // Most browsers include Mozilla
    lowerUA.includes('automated'), // Explicitly automated
    lowerUA.includes('test'), // Testing tools
    /^[a-z]+\/\d+(\.\d+)*$/.test(lowerUA) // Simple tool/version pattern
  ]

  const suspiciousScore = botIndicators.filter(Boolean).length
  if (suspiciousScore >= 2) {
    return { isBot: true, isAllowedCrawler: false, botType: 'suspicious-pattern' }
  }

  return { isBot: false, isAllowedCrawler: false }
}

/**
 * Checks if the request path contains suspicious patterns
 */
function hasSuspiciousPath(pathname: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => 
    pathname.toLowerCase().includes(pattern)
  )
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')
  const referer = request.headers.get('referer')
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  // Skip middleware for static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') && !pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  // Analyze the user agent
  const { isBot, isAllowedCrawler, botType } = analyzeUserAgent(userAgent)

  // Block suspicious paths regardless of user agent
  if (hasSuspiciousPath(pathname)) {
    console.warn(`[SECURITY] Blocked suspicious path: ${pathname} from ${ip}`)
    return new NextResponse('Not Found', { status: 404 })
  }

  // Handle bot requests
  if (isBot) {
    // Allow legitimate crawlers for main pages only
    if (isAllowedCrawler && (pathname === '/' || pathname.startsWith('/about'))) {
      // Add rate limiting headers for crawlers
      const response = NextResponse.next()
      response.headers.set('X-Robots-Tag', 'index, follow')
      response.headers.set('Cache-Control', 'public, max-age=3600')
      console.log(`[SECURITY] Allowed crawler: ${botType} from ${ip}`)
      return response
    }

    // Block all other bots from API endpoints
    if (pathname.startsWith('/api/')) {
      console.warn(`[SECURITY] Blocked bot API access: ${botType} from ${ip}`)
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Block bots from main app if not allowed crawler
    if (!isAllowedCrawler) {
      console.warn(`[SECURITY] Blocked bot: ${botType} from ${ip}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Additional security checks for API routes
  if (pathname.startsWith('/api/')) {
    // Require referer for API calls (CSRF protection)
    if (!referer) {
      console.warn(`[SECURITY] API call without referer from ${ip}`)
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Check if referer is from same origin (basic CSRF protection)
    const refererUrl = new URL(referer)
    const requestUrl = new URL(request.url)
    
    if (refererUrl.origin !== requestUrl.origin) {
      console.warn(`[SECURITY] Cross-origin API call from ${refererUrl.origin} to ${requestUrl.origin}`)
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Add security headers to API responses
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    return response
  }

  // Allow legitimate requests
  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}