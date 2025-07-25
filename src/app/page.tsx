"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTravelContext } from "@/contexts/TravelContext"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveTropicalBackground } from "@/components/illustrations"
import { FeaturedDestinationsGrid } from "@/components/layout/FeaturedDestinationsGrid"

export default function HomePage() {
  const { state } = useTravelContext()
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Tropical Background - only show in hero section */}
      <div className="absolute inset-0 h-screen">
        <ResponsiveTropicalBackground />
      </div>
      {/* Hero Section */}
      <section className="relative px-4 py-32 text-center min-h-screen flex items-center justify-center z-50">
        <div className="mx-auto max-w-4xl w-full">
          <h1 className="mb-8 text-5xl font-bold text-gray-900 md:text-7xl drop-shadow-sm">
            Your AI Travel Planning
            <span className="text-sky-600"> Assistant</span>
          </h1>
          <p className="mb-16 text-xl text-gray-700 md:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            Tell me about your dream trip
          </p>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="I want to visit beaches in Thailand with my family on a $3000 budget..."
              className="w-full px-10 py-8 text-xl md:text-2xl rounded-2xl border-2 border-gray-300 focus:border-sky-500 focus:outline-none shadow-xl bg-white placeholder:text-gray-400 transition-all duration-200 hover:border-gray-400"
              autoFocus
            />
          </form>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <Card className="text-center group">
              <CardHeader>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-500 text-white text-2xl font-bold shadow-lg group-hover:from-sky-500 group-hover:to-sky-600 transition-all">
                  1
                </div>
                <CardTitle className="text-xl mb-4">Tell Us About Your Dream Trip</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Share your budget, preferences, travel dates, and any special requirements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group">
              <CardHeader>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white text-2xl font-bold shadow-lg group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all">
                  2
                </div>
                <CardTitle className="text-xl mb-4">AI Analyzes & Recommends</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Our intelligent assistant processes your needs and finds the perfect destinations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group">
              <CardHeader>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white text-2xl font-bold shadow-lg group-hover:from-amber-500 group-hover:to-amber-600 transition-all">
                  3
                </div>
                <CardTitle className="text-xl mb-4">Get Your Perfect Itinerary</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Receive detailed day-by-day plans, budget breakdowns, and booking information
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section (appears when trips are recommended) */}
      {state.recommendedTrips.length > 0 && (
        <section className="px-4 py-16 bg-white">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              AI Recommended Trips for You
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {state.recommendedTrips.map((trip) => (
                <Card key={trip.tripId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{trip.destination}</CardTitle>
                    <CardDescription>
                      {trip.duration} days • ${trip.estimatedCost.toLocaleString()}
                    </CardDescription>
                    <div className="mt-2">
                      {trip.highlights.slice(0, 2).map((highlight, index) => (
                        <span
                          key={index}
                          className="mr-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Destinations */}
      <section className="px-4 py-24 bg-gradient-to-b from-white to-sky-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing destinations handpicked by our AI travel assistant for unforgettable experiences
            </p>
          </div>
          <FeaturedDestinationsGrid />
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-24 bg-sky-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from families who used our AI travel assistant
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-white text-2xl font-bold">
                  SM
                </div>
                <div className="mb-4">
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 italic mb-4">
                    "The AI perfectly understood our family's needs and budget. Our Orlando trip was magical - the kids loved every recommendation!"
                  </blockquote>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Martinez</div>
                  <div className="text-sm text-gray-500">Family of 4 • Orlando, FL</div>
                </div>
              </CardHeader>
            </Card>

            {/* Testimonial 2 */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 text-white text-2xl font-bold">
                  JL
                </div>
                <div className="mb-4">
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 italic mb-4">
                    "Amazing budget-friendly suggestions! The AI found us incredible deals in Prague that we never would have discovered ourselves."
                  </blockquote>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">James Liu</div>
                  <div className="text-sm text-gray-500">Couple • Prague, Czech Republic</div>
                </div>
              </CardHeader>
            </Card>

            {/* Testimonial 3 */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white text-2xl font-bold">
                  RT
                </div>
                <div className="mb-4">
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 italic mb-4">
                    "The personalized itinerary was spot-on! Every recommendation matched our adventure-loving style perfectly."
                  </blockquote>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rachel Thompson</div>
                  <div className="text-sm text-gray-500">Solo Traveler • Iceland</div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-3xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                DreamVoyager Travel
              </h3>
              <p className="mb-6 text-gray-400 text-lg leading-relaxed">
                AI-powered travel planning that creates unforgettable adventures tailored to your dreams, budget, and family needs.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Featured Destinations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Start Planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>

            {/* Developer Attribution */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Portfolio Project</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <p>
                  This is a demonstration project showcasing AI integration and modern web development.
                </p>
                <div className="space-y-2">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Source Code
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Developer Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DreamVoyager Travel. This is a portfolio demonstration project.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
