import { NextResponse } from 'next/server'
import { apiUsageService } from '@/services/apiUsageService'

export async function GET() {
  try {
    const stats = apiUsageService.getAllStats()
    const totalCost = apiUsageService.getTotalCostToday()
    const quotaWarnings = apiUsageService.getQuotaWarnings()
    
    return NextResponse.json({
      stats,
      totalCost,
      quotaWarnings,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    )
  }
}