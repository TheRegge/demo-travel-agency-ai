import { NextRequest, NextResponse } from 'next/server';
import { apiUsageService } from '@/services/apiUsageService';

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination');

  if (!destination) {
    return NextResponse.json(
      { error: 'Destination parameter is required' },
      { status: 400 }
    );
  }

  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  // Return empty response if no API key (client will use gradient fallback)
  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json({
      imageUrl: '',
      altText: `${destination} destination`
    });
  }

  try {
    const searchQuery = `${destination} travel destination landmark`;
    const UNSPLASH_API_URL = 'https://api.unsplash.com';
    
    const startTime = Date.now();
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape&order_by=relevant`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const responseTime = Date.now() - startTime;
      apiUsageService.recordAPICall('unsplash', responseTime, true);
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const responseTime = Date.now() - startTime;
    apiUsageService.recordAPICall('unsplash', responseTime, false);
    const data: UnsplashResponse = await response.json();
    
    if (data.results.length === 0) {
      return NextResponse.json({
        imageUrl: '',
        altText: `${destination} destination`
      });
    }

    const photo = data.results[0];
    
    return NextResponse.json({
      imageUrl: photo.urls.regular,
      altText: photo.alt_description || photo.description || `${destination} destination`,
      attribution: {
        photographer: photo.user.name,
        username: photo.user.username
      }
    });

  } catch (error) {
    console.error('❌ Error fetching destination photo:', error);
    // API call tracking is handled in the response check above
    
    // Return empty response for gradient fallback
    return NextResponse.json({
      imageUrl: '',
      altText: `${destination} destination`
    });
  }
}