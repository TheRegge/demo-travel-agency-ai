import React from 'react'

interface PalmTreesProps {
  className?: string
  animate?: boolean
}

export function PalmTrees({ className = '', animate = true }: PalmTreesProps) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 pointer-events-none ${className}`}>
      {/* Palm Tree 1 - Left side */}
      <svg
        className={`absolute bottom-0 left-8 w-32 h-40 ${animate ? 'animate-palm-sway' : ''}`}
        style={{ transformOrigin: 'bottom center', animationDelay: '0s' }}
        viewBox="0 0 128 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <path
          d="M60 160V60c0-2 1-4 4-4s4 2 4 4v100h-8z"
          fill="#FB923C"
          stroke="#EA8A3A"
          strokeWidth="1"
        />
        
        {/* Palm fronds - much larger */}
        <g>
          {/* Frond 1 - Left sweeping */}
          <path
            d="M64 64C48 40, 20 25, -8 35c-8 3-12 8-8 12 4 4 12 2 20-2 16-8 32-4 40 4 4 4 8 4 12 2z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 2 - Right sweeping */}
          <path
            d="M64 64C80 40, 108 25, 136 35c8 3 12 8 8 12-4 4-12 2-20-2-16-8-32-4-40 4-4 4-8 4-12 2z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 3 - Top center */}
          <path
            d="M64 64C60 40, 68 16, 88 8c6-2 12 2 12 8 0 6-6 10-14 12-16 4-24 20-20 32 2 6-2 8-2 4z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 4 - Top left */}
          <path
            d="M64 64C68 40, 60 16, 40 8c-6-2-12 2-12 8 0 6 6 10 14 12 16 4 24 20 20 32-2 6 2 8 2 4z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 5 - Right diagonal */}
          <path
            d="M64 64C76 44, 96 32, 120 40c6 2 8 8 4 12-4 4-10 2-16-2-12-8-24-4-32 4-4 4-8 6-12 10z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 6 - Left diagonal */}
          <path
            d="M64 64C52 44, 32 32, 8 40c-6 2-8 8-4 12 4 4 10 2 16-2 12-8 24-4 32 4 4 4 8 6 12 10z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* Palm Tree 2 - Right side, smaller */}
      <svg
        className={`absolute bottom-0 right-12 w-28 h-36 ${animate ? 'animate-palm-sway' : ''}`}
        style={{ transformOrigin: 'bottom center', animationDelay: '1.5s' }}
        viewBox="0 0 112 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <path
          d="M52 144V50c0-2 1-3 4-3s4 1 4 3v94h-8z"
          fill="#FB923C"
          stroke="#EA8A3A"
          strokeWidth="1"
        />
        
        {/* Palm fronds - much larger */}
        <g>
          {/* Frond 1 - Left sweeping */}
          <path
            d="M56 54C44 35, 24 25, 4 32c-5 2-8 6-6 9 2 3 8 1 13-1 10-5 20-2 26 3 3 2 5 2 8 1z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 2 - Right sweeping */}
          <path
            d="M56 54C68 35, 88 25, 108 32c5 2 8 6 6 9-2 3-8 1-13-1-10-5-20-2-26 3-3 2-5 2-8 1z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 3 - Top center */}
          <path
            d="M56 54C54 35, 60 18, 74 13c4-1 8 1 8 5 0 4-4 6-9 7-10 3-16 12-13 20 1 4-1 5-1 3z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 4 - Top left */}
          <path
            d="M56 54C58 35, 52 18, 38 13c-4-1-8 1-8 5 0 4 4 6 9 7 10 3 16 12 13 20-1 4 1 5 1 3z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          
          {/* Frond 5 - Right diagonal */}
          <path
            d="M56 54C65 40, 80 32, 98 37c4 1 6 5 3 8-3 3-7 1-11-1-8-5-16-2-21 3-3 3-5 4-8 7z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* Palm Tree 3 - Center background, very small */}
      <svg
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-30 opacity-60 ${animate ? 'animate-palm-sway' : ''}`}
        style={{ transformOrigin: 'bottom center', animationDelay: '3s' }}
        viewBox="0 0 80 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <path
          d="M36 120V40c0-1 1-2 4-2s4 1 4 2v80h-8z"
          fill="#FB923C"
          stroke="#EA8A3A"
          strokeWidth="1"
        />
        
        {/* Larger palm fronds */}
        <g>
          {/* Left frond */}
          <path
            d="M40 44C32 30, 18 22, 4 26c-4 1-6 4-4 6 2 2 6 0 10-2 8-4 16-2 20 2 2 2 4 2 6 2z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          {/* Right frond */}
          <path
            d="M40 44C48 30, 62 22, 76 26c4 1 6 4 4 6-2 2-6 0-10-2-8-4-16-2-20 2-2 2-4 2-6 2z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          {/* Top frond */}
          <path
            d="M40 44C40 28, 44 16, 54 12c2-1 6 1 6 4 0 2-2 4-6 6-8 2-12 10-10 16 1 2 0 4-2 2z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
          {/* Top left frond */}
          <path
            d="M40 44C40 28, 36 16, 26 12c-2-1-6 1-6 4 0 2 2 4 6 6 8 2 12 10 10 16-1 2 0 4 2 2z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  )
}