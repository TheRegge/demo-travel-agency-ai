#!/usr/bin/env node

/**
 * Test script for flight data fallback functionality
 * Run with: node test-flight-fallback.js
 */

import { amadeusService } from './src/services/amadeusService.js';
import { realDataService } from './src/services/realDataService.js';

async function testAmadeusAPI() {
  console.log('🧪 Testing Amadeus API Status...\n');
  
  try {
    const apiStatus = await amadeusService.getApiStatus();
    console.log('📊 API Status:', apiStatus);
    
    if (apiStatus.authenticated) {
      console.log('\n🧪 Testing Dublin flight search...');
      const dublinTest = await amadeusService.testDublinFlights();
      console.log('🇮🇪 Dublin Test Result:', dublinTest);
    } else {
      console.log('⚠️ API not authenticated - skipping flight test');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testFlightFallback() {
  console.log('\n🧪 Testing Flight Fallback System...\n');
  
  // Test destinations that might not have flight data
  const testDestinations = [
    'Dublin, Ireland',
    'Unknown City, Nowhere',
    'Tokyo, Japan',
    'NonExistent Place'
  ];
  
  for (const destination of testDestinations) {
    console.log(`\n🔍 Testing: ${destination}`);
    try {
      const enhancedTrip = await realDataService.enhanceTripRecommendation({
        tripId: 'test-001',
        destination,
        duration: 5,
        estimatedCost: 2500,
        highlights: ['Test highlight'],
        description: 'Test trip description',
        activities: ['Test activity'],
        season: 'spring',
        kidFriendly: true,
        customizations: {},
        score: 85,
        type: 'single'
      }, {
        includeFlights: true,
        includeHotels: true,
        includeWeather: true
      });
      
      console.log(`✅ Enhanced trip for ${destination}:`);
      console.log(`  - Data Source: ${enhancedTrip.dataSource}`);
      console.log(`  - Flights Available: ${enhancedTrip.realData?.flights ? enhancedTrip.realData.flights.length : 0}`);
      console.log(`  - Flight Data Source: ${enhancedTrip.apiSources.flightData ? 'Real API' : 'Fallback'}`);
      console.log(`  - User Message: ${enhancedTrip.dataSourceMessage || 'None'}`);
      
    } catch (error) {
      console.error(`❌ Failed to enhance trip for ${destination}:`, error.message);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Flight Data Enhancement Tests\n');
  console.log('=' .repeat(60));
  
  await testAmadeusAPI();
  await testFlightFallback();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests completed!');
}

// Run tests
runTests().catch(console.error);