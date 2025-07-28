/**
 * AI Extraction Debugger Component
 * Shows what information the AI extracted from user input for debugging purposes
 */

"use client"

import { ConversationContext } from '@/types/travel'

interface AIExtractionDebuggerProps {
  context: ConversationContext | null
  userInput?: string
  isVisible?: boolean
}

export function AIExtractionDebugger({ 
  context, 
  userInput = "", 
  isVisible = true 
}: AIExtractionDebuggerProps) {
  // Debug logging to see why component isn't appearing
  console.log('🐛 AIExtractionDebugger render:', {
    isVisible,
    hasContext: !!context,
    userInput: userInput?.substring(0, 50),
    context: context ? Object.keys(context) : 'null'
  })
  
  if (!isVisible) {
    console.log('🐛 AIExtractionDebugger: Not visible')
    return null
  }
  
  if (!context) {
    console.log('🐛 AIExtractionDebugger: No context provided')
    // Show a placeholder to verify the component is mounting
    return (
      <div className="fixed top-4 right-4 bg-red-900/90 text-red-300 p-3 rounded-lg w-80 text-xs font-mono z-[9999] border border-red-500/30 shadow-lg">
        <div className="text-red-200 font-bold mb-2">🚨 DEBUG: No Context</div>
        <div className="text-xs leading-relaxed">Component is rendering but no context provided</div>
        <div className="text-xs mt-2 break-words">User input: {userInput || 'none'}</div>
      </div>
    )
  }

  const { extractedInfo, userIntent, conversationStage, missingInfo } = context

  return (
    <div className="fixed top-4 right-4 bg-black/95 text-green-400 p-4 rounded-lg w-80 text-xs font-mono z-[9999] border border-green-500/30 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-green-300 font-bold text-sm">🤖 AI DEBUG</span>
        <span className="text-xs text-gray-400 uppercase">{conversationStage}</span>
      </div>
      
      {userInput && (
        <div className="mb-3 p-2 bg-gray-800/50 rounded border-l-2 border-blue-400">
          <div className="text-blue-300 font-semibold mb-1">User Input:</div>
          <div className="text-gray-300 text-xs break-words leading-relaxed">{userInput.substring(0, 100)}{userInput.length > 100 ? '...' : ''}</div>
        </div>
      )}

      <div className="space-y-2">
        <DebugItem 
          label="Destination" 
          value={userIntent.destinations?.join(', ') || 'Not specified'} 
          isExtracted={Boolean(userIntent.destinations?.length)}
        />
        
        <DebugItem 
          label="Trip Type" 
          value={userIntent.tripTypeHint || 'unknown'} 
          isExtracted={userIntent.tripTypeHint !== 'unknown'}
        />
        
        <DebugItem 
          label="Duration" 
          value={extractedInfo.duration ? `${extractedInfo.duration} days` : 'Not specified'} 
          isExtracted={Boolean(extractedInfo.duration)}
        />
        
        <DebugItem 
          label="Dates" 
          value={extractedInfo.dates 
            ? `${extractedInfo.dates.startDate || 'N/A'} to ${extractedInfo.dates.endDate || 'N/A'}${extractedInfo.dates.season ? ` (${extractedInfo.dates.season})` : ''}`
            : 'Not specified'
          } 
          isExtracted={Boolean(extractedInfo.dates)}
        />
        
        <DebugItem 
          label="Period" 
          value={extractedInfo.period || 'Not specified'} 
          isExtracted={Boolean(extractedInfo.period)}
        />
        
        <DebugItem 
          label="Budget" 
          value={extractedInfo.budget ? `$${extractedInfo.budget.toLocaleString()}` : 'Not specified'} 
          isExtracted={Boolean(extractedInfo.budget)}
        />
        
        <DebugItem 
          label="Travelers" 
          value={extractedInfo.travelers 
            ? `${extractedInfo.travelers.adults} adults, ${extractedInfo.travelers.children} children` 
            : 'Not specified'
          } 
          isExtracted={Boolean(extractedInfo.travelers)}
        />
        
        <DebugItem 
          label="Accommodation" 
          value={extractedInfo.accommodationType || 'Not specified'} 
          isExtracted={Boolean(extractedInfo.accommodationType)}
        />
        
        <DebugItem 
          label="Preferences" 
          value={extractedInfo.preferences?.join(', ') || 'None'} 
          isExtracted={Boolean(extractedInfo.preferences?.length)}
        />
        
        <DebugItem 
          label="Keywords" 
          value={userIntent.keywords?.join(', ') || 'None'} 
          isExtracted={Boolean(userIntent.keywords?.length)}
        />
        
        <DebugItem 
          label="Ambiguity" 
          value={userIntent.ambiguityLevel} 
          isExtracted={userIntent.ambiguityLevel === 'clear'}
        />
      </div>

      {missingInfo && missingInfo.length > 0 && (
        <div className="mt-3 p-2 bg-red-900/30 rounded border-l-2 border-red-400">
          <div className="text-red-300 font-semibold mb-1">Missing Info:</div>
          <div className="text-red-200 text-xs break-words leading-relaxed">
            {missingInfo.map(info => info.replace('_', ' ')).join(', ')}
          </div>
        </div>
      )}
    </div>
  )
}

interface DebugItemProps {
  label: string
  value: string
  isExtracted: boolean
}

function DebugItem({ label, value, isExtracted }: DebugItemProps) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-gray-400 min-w-fit text-xs">{label}:</span>
      <div className="flex items-start gap-1 flex-1 min-w-0">
        <span className={`${isExtracted ? 'text-green-400' : 'text-gray-500'} text-xs break-words flex-1`}>
          {value}
        </span>
        <span className={`${isExtracted ? 'text-green-400' : 'text-red-400'} text-xs min-w-fit`}>
          {isExtracted ? '✓' : '✗'}
        </span>
      </div>
    </div>
  )
}