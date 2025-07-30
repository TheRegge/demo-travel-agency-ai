"use client"

import { useEffect, useState } from "react"

interface AnimatedLogoProps {
  className?: string
  hasMessages?: boolean
}

export const AnimatedLogo = ({ className = "", hasMessages = false }: AnimatedLogoProps) => {
  const [showText, setShowText] = useState(true)

  useEffect(() => {
    if (hasMessages) {
      const timer = setTimeout(() => {
        setShowText(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setShowText(true)
    }
  }, [hasMessages])

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
        <svg 
          className="w-6 h-6 sm:w-7 sm:h-7 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          role="img"
          aria-label="DreamVoyager travel logo with world map icon"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div 
        className={`text-gray-900 drop-shadow-sm transition-all duration-500 ease-in-out ${
          showText ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        } overflow-hidden`}
      >
        <div className="text-base sm:text-lg font-bold whitespace-nowrap">DreamVoyager</div>
        <div className="text-xs opacity-75 whitespace-nowrap">AI Travel</div>
      </div>
    </div>
  )
}