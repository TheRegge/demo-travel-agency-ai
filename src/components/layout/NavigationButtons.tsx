import { ExternalLink, Code2 } from 'lucide-react'

interface NavigationButtonsProps {
  className?: string
}

export function NavigationButtons({ className = '' }: NavigationButtonsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {/* GitHub Repository Button */}
      <a
        href="https://github.com/TheRegge/demo-travel-agency-ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 sm:gap-2 sm:px-4 sm:py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white/90 hover:bg-black/30 hover:text-white transition-all duration-200 text-xs sm:text-sm font-medium"
        aria-label="View source code on GitHub"
      >
        <Code2 size={12} className="sm:w-4 sm:h-4" />
        <span>GITHUB</span>
      </a>
      
      {/* Portfolio Button */}
      <a
        href="https://zaleman.co"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 sm:gap-2 sm:px-4 sm:py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white/90 hover:bg-black/30 hover:text-white transition-all duration-200 text-xs sm:text-sm font-medium"
        aria-label="Visit Regis Zaleman's portfolio"
      >
        <ExternalLink size={12} className="sm:w-4 sm:h-4" />
        <span>PORTFOLIO</span>
      </a>
    </div>
  )
}