import { NextResponse } from 'next/server'
import { apiUsageService } from '@/services/apiUsageService'
import { realDataService } from '@/services/realDataService'

export async function GET() {
  // Test API call recording
  console.log('🧪 Testing API usage tracking...')
  
  // Record a test API call
  apiUsageService.recordAPICall('test-provider', 150, false, { tokens: 10 })
  
  // Check API status
  const apiStatus = realDataService.getApiStatus()
  console.log('🔑 API Status:', apiStatus)
  
  // Get current usage stats
  const stats = apiUsageService.getAllStats()
  console.log('📊 Current API Stats:', stats)
  
  return NextResponse.json({
    message: 'API test completed',
    apiStatus,
    currentStats: stats,
    testRecorded: true
  })
}