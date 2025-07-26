import React from 'react'
import { FloatingClouds } from './FloatingClouds'
import { PalmTrees } from './PalmTrees'
import { OceanWaves } from './OceanWaves'

interface TropicalBackgroundProps {
  className?: string
  animate?: boolean
  showClouds?: boolean
  showPalms?: boolean
  showWaves?: boolean
  intensity?: 'minimal' | 'moderate' | 'full'
}

export function TropicalBackground({
  className = '',
  animate = true,
  showClouds = true,
  showPalms = true,
  showWaves = true,
  intensity = 'full'
}: TropicalBackgroundProps) {
  // Responsive intensity based on screen size
  const getResponsiveIntensity = () => {
    if (intensity === 'minimal') {
      return {
        showClouds: showClouds && false, // No clouds on minimal
        showPalms: showPalms && true,    // Only essential palms
        showWaves: showWaves && true,    // Simple waves
      }
    }
    
    if (intensity === 'moderate') {
      return {
        showClouds: showClouds && true,  // Some clouds
        showPalms: showPalms && true,    // Palms visible
        showWaves: showWaves && true,    // Waves visible
      }
    }
    
    // Full intensity
    return {
      showClouds: showClouds,
      showPalms: showPalms,
      showWaves: showWaves,
    }
  }

  const responsive = getResponsiveIntensity()

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 tropical-gradient" />
      
      {/* Top layer: Floating clouds */}
      {responsive.showClouds && (
        <FloatingClouds animate={animate} className="z-10" />
      )}
      
      {/* Bottom layer: Ocean waves */}
      {responsive.showWaves && (
        <OceanWaves animate={animate} className="z-20" />
      )}
      
      {/* Foreground: Palm trees */}
      {responsive.showPalms && (
        <PalmTrees animate={animate} className="z-30" />
      )}
      
    </div>
  )
}

// Responsive wrapper that adjusts intensity based on screen size
export function ResponsiveTropicalBackground({
  className = '',
  animate = true,
  ...props
}: Omit<TropicalBackgroundProps, 'intensity'>) {
  return (
    <>
      {/* Desktop: Full scene */}
      <TropicalBackground 
        {...props}
        className={`hidden lg:block ${className}`}
        intensity="full"
        animate={animate}
      />
      
      {/* Tablet: Simplified scene */}
      <TropicalBackground 
        {...props}
        className={`hidden md:block lg:hidden ${className}`}
        intensity="moderate"
        animate={animate}
      />
      
      {/* Mobile: Essential elements only */}
      <TropicalBackground 
        {...props}
        className={`block md:hidden ${className}`}
        intensity="minimal"
        animate={animate}
      />
    </>
  )
}