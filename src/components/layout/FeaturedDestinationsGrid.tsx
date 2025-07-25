"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { allMockDestinations } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils"
import { Heart, MapPin, Star, Users } from "lucide-react"
import { useState } from "react"

export function FeaturedDestinationsGrid() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  // Get featured destinations - mix of categories for variety
  const featuredDestinations = allMockDestinations.slice(0, 6)
  
  const toggleFavorite = (destinationId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(destinationId)) {
      newFavorites.delete(destinationId)
    } else {
      newFavorites.add(destinationId)
    }
    setFavorites(newFavorites)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'family-friendly':
        return <Users className="w-4 h-4" />
      case 'luxury':
        return <Star className="w-4 h-4" />
      case 'adventure':
        return <MapPin className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'family-friendly':
        return 'bg-emerald-100 text-emerald-700'
      case 'luxury':
        return 'bg-amber-100 text-amber-700'
      case 'adventure':
        return 'bg-orange-100 text-orange-700'
      case 'budget':
        return 'bg-sky-100 text-sky-700'
      case 'cultural':
        return 'bg-purple-100 text-purple-700'
      case 'scenic':
        return 'bg-green-100 text-green-700'
      case 'urban':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-sky-100 text-sky-700'
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {featuredDestinations.map((destination) => (
        <Card key={destination.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Destination Image Placeholder */}
          <div className="relative h-48 bg-gradient-to-br from-sky-400 via-sky-500 to-emerald-400 overflow-hidden">
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(destination.id)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <Heart 
                className={`w-5 h-5 ${
                  favorites.has(destination.id) 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600'
                }`} 
              />
            </button>
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(destination.category)}`}>
                {getCategoryIcon(destination.category)}
                {destination.category.replace('-', ' ')}
              </span>
            </div>

            {/* Kid Friendly Badge */}
            {destination.kidFriendlyScore >= 7.5 && (
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium">
                  <Users className="w-3 h-3" />
                  Family Friendly
                </span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2 group-hover:text-sky-600 transition-colors">
                  {destination.name}
                </CardTitle>
                <div className="flex items-center gap-1 text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{destination.location.country}</span>
                </div>
              </div>
            </div>
            
            <CardDescription className="text-base leading-relaxed line-clamp-3">
              {destination.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Price Range */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Starting from</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-sky-600">
                    {formatPrice(destination.seasonalPricing.offSeason)}
                  </div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Peak season: {formatPrice(destination.seasonalPricing.peak)}
              </div>
            </div>

            {/* Top Activities */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Activities:</h4>
              <div className="flex flex-wrap gap-1">
                {destination.activities.slice(0, 3).map((activity, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-sky-50 text-sky-700 rounded-full"
                  >
                    {activity.name}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              variant="tropical" 
              className="w-full group-hover:shadow-lg transition-shadow"
            >
              Explore {destination.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}