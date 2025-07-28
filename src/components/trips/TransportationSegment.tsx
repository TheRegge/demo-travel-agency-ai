/**
 * Transportation Segment Component
 * Displays transport method, duration, and cost with icons
 */

import { TransportationOption } from "@/types/travel"
import { getTransportIcon, getTransportDisplayName } from "@/lib/mock-data/transportation"
import { Badge } from "@/components/ui/badge"
import { Clock, Info } from "lucide-react"

interface TransportationSegmentProps {
  transport: TransportationOption
  className?: string
  showAlternatives?: boolean
  compact?: boolean
}

export const TransportationSegment = ({ 
  transport, 
  className = "",
  showAlternatives = false,
  compact = false
}: TransportationSegmentProps) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs text-gray-600 bg-white border border-gray-200 rounded-md px-2 py-1.5 ${className}`}>
        <span className="text-lg">{getTransportIcon(transport.method)}</span>
        <span className="font-medium">{getTransportDisplayName(transport.method)}</span>
        <span className="text-gray-400">•</span>
        <span>{transport.duration}</span>
        <span className="text-gray-400">•</span>
        <span className="font-medium text-emerald-600">${transport.cost}</span>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Main Transport Option */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">
          {getTransportIcon(transport.method)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">
              {getTransportDisplayName(transport.method)}
            </h4>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
              ${transport.cost}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{transport.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{transport.duration}</span>
            </div>
            {transport.bookingInfo && (
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span className="truncate">{transport.bookingInfo}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Transport Options */}
      {showAlternatives && transport.alternatives && transport.alternatives.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Alternative Options</h5>
          <div className="space-y-3">
            {transport.alternatives.map((alt, index) => (
              <div key={index} className="bg-gray-50 rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTransportIcon(alt.method)}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {getTransportDisplayName(alt.method)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">{alt.duration}</span>
                    <span className="font-medium text-gray-700">${alt.cost}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{alt.description}</p>
                
                {(alt.pros || alt.cons) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {alt.pros && (
                      <div>
                        <p className="text-xs font-medium text-green-700 mb-1">Pros:</p>
                        <ul className="text-xs text-green-600 space-y-0.5">
                          {alt.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-green-500 mt-0.5">+</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {alt.cons && (
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">Cons:</p>
                        <ul className="text-xs text-red-600 space-y-0.5">
                          {alt.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-red-500 mt-0.5">-</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TransportationSegment