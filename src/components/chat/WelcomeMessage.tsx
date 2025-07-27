/**
 * Welcome Message Component
 * Displays the initial welcome screen before chat begins
 */

interface WelcomeMessageProps {
  className?: string
}

export const WelcomeMessage = ({ className = "" }: WelcomeMessageProps) => {
  return (
    <div className={`text-center ${className}`}>
      <h1 id="welcome-heading" className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-7xl drop-shadow-sm">
        Your AI Travel Planning
        <span className="text-sky-600"> Assistant</span>
      </h1>
      <p className="text-lg text-gray-700 sm:text-xl md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-sm" role="complementary">
        Tell me about your dream trip
      </p>
    </div>
  )
}