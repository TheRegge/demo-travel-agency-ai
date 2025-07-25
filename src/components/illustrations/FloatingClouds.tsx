import React from 'react'

interface FloatingCloudsProps {
  className?: string
  animate?: boolean
}

export function FloatingClouds({ className = '', animate = true }: FloatingCloudsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Cloud 1 - Large */}
      <svg
        className={`absolute top-12 -left-20 w-32 h-20 text-white opacity-80 ${animate ? 'animate-cloud-drift' : ''}`}
        style={{ animationDelay: '0s', animationDuration: '30s' }}
        viewBox="0 0 128 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 50 C20 35, 32 25, 45 25 C50 15, 65 10, 75 18 C85 5, 105 10, 110 25 C120 25, 125 35, 120 45 C125 50, 120 60, 110 60 L25 60 C15 60, 10 50, 20 50 Z"
          fill="currentColor"
        />
      </svg>

      {/* Cloud 2 - Medium */}
      <svg
        className={`absolute top-24 left-1/3 w-24 h-16 text-white opacity-70 ${animate ? 'animate-cloud-drift' : ''}`}
        style={{ animationDelay: '10s', animationDuration: '40s' }}
        viewBox="0 0 96 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 40 C15 30, 25 20, 35 20 C40 12, 50 8, 58 15 C65 8, 78 12, 82 25 C88 25, 92 30, 88 38 C92 42, 88 50, 82 50 L20 50 C10 50, 8 40, 15 40 Z"
          fill="currentColor"
        />
      </svg>

      {/* Cloud 3 - Small */}
      <svg
        className={`absolute top-8 right-1/4 w-20 h-12 text-white opacity-60 ${animate ? 'animate-cloud-drift' : ''}`}
        style={{ animationDelay: '20s', animationDuration: '35s' }}
        viewBox="0 0 80 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 30 C12 22, 18 15, 26 15 C30 10, 38 8, 44 12 C50 8, 60 10, 65 20 C70 20, 72 25, 68 30 C72 33, 68 38, 65 38 L18 38 C10 38, 8 30, 12 30 Z"
          fill="currentColor"
        />
      </svg>

      {/* Cloud 4 - Large right side */}
      <svg
        className={`absolute top-20 -right-16 w-28 h-18 text-white opacity-75 ${animate ? 'animate-cloud-drift' : ''}`}
        style={{ animationDelay: '15s', animationDuration: '45s' }}
        viewBox="0 0 112 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 45 C18 32, 28 22, 40 22 C45 15, 55 10, 65 18 C72 10, 85 12, 92 25 C100 25, 105 32, 100 40 C105 45, 100 55, 92 55 L25 55 C12 55, 10 45, 18 45 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}