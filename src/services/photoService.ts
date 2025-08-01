/**
 * Photo Service
 * Fetches destination photos via server-side API
 */

/**
 * Fetch a destination photo from our secure API endpoint
 * Falls back to a gradient if no photo is found or API fails
 */
export const getDestinationPhoto = async (destination: string): Promise<{
  imageUrl: string;
  altText: string;
  attribution?: {
    photographer: string;
    username: string;
  };
}> => {
  try {
    const response = await fetch(`/api/photos?destination=${encodeURIComponent(destination)}`);

    if (!response.ok) {
      throw new Error(`Photo API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return {
      imageUrl: data.imageUrl || '',
      altText: data.altText || `${destination} destination`,
      attribution: data.attribution
    };

  } catch {
    
    // Return gradient fallback on error
    return {
      imageUrl: '',
      altText: `${destination} destination`
    };
  }
};

/**
 * Generate a gradient background based on destination name
 * Used as fallback when photo loading fails
 */
export const getDestinationGradient = (destination: string): string => {
  // Simple hash function to generate consistent colors for destinations
  let hash = 0;
  for (let i = 0; i < destination.length; i++) {
    const char = destination.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate colors based on hash
  const colors = [
    'from-blue-400 via-purple-500 to-pink-500',
    'from-green-400 via-teal-500 to-blue-500', 
    'from-yellow-400 via-orange-500 to-red-500',
    'from-purple-400 via-pink-500 to-red-500',
    'from-cyan-400 via-blue-500 to-purple-500',
    'from-emerald-400 via-cyan-500 to-blue-500',
    'from-rose-400 via-pink-500 to-purple-500',
    'from-amber-400 via-orange-500 to-pink-500'
  ];
  
  const colorIndex = Math.abs(hash) % colors.length;
  return `bg-gradient-to-br ${colors[colorIndex]}`;
};