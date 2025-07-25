import React from 'react'

interface OceanWavesProps {
  className?: string
  animate?: boolean
}

export function OceanWaves({ className = '', animate = true }: OceanWavesProps) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 pointer-events-none ${className}`}>
      {/* Wave Layer 1 - Background */}
      <svg
        className={`absolute bottom-0 w-full h-16 text-sky-200 ${animate ? 'animate-wave-motion' : ''}`}
        style={{ animationDelay: '0s', animationDuration: '4s' }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 V120 H0 V60Z"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>

      {/* Wave Layer 2 - Middle */}
      <svg
        className={`absolute bottom-0 w-full h-12 text-sky-300 ${animate ? 'animate-wave-motion' : ''}`}
        style={{ animationDelay: '1s', animationDuration: '3.5s' }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,48 C200,80 400,16 600,48 C800,80 1000,16 1200,48 V96 H0 V48Z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>

      {/* Wave Layer 3 - Foreground */}
      <svg
        className={`absolute bottom-0 w-full h-8 text-sky-400 ${animate ? 'animate-wave-motion' : ''}`}
        style={{ animationDelay: '2s', animationDuration: '3s' }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,32 C300,64 900,0 1200,32 V64 H0 V32Z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>

      {/* Foam caps - small white dots */}
      <div className="absolute bottom-0 w-full h-8 overflow-hidden">
        {/* Foam dots */}
        <div
          className={`absolute bottom-2 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 ${animate ? 'animate-bounce' : ''}`}
          style={{ animationDelay: '0.5s', animationDuration: '2s' }}
        />
        <div
          className={`absolute bottom-3 left-1/2 w-1 h-1 bg-white rounded-full opacity-50 ${animate ? 'animate-bounce' : ''}`}
          style={{ animationDelay: '1s', animationDuration: '2.5s' }}
        />
        <div
          className={`absolute bottom-2 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-70 ${animate ? 'animate-bounce' : ''}`}
          style={{ animationDelay: '1.5s', animationDuration: '2.2s' }}
        />
        <div
          className={`absolute bottom-4 left-2/3 w-1 h-1 bg-white rounded-full opacity-40 ${animate ? 'animate-bounce' : ''}`}
          style={{ animationDelay: '0.8s', animationDuration: '2.8s' }}
        />
      </div>
    </div>
  )
}