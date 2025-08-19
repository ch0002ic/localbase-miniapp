// Image validation utility
export const validateImageUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) return { isValid: true }; // Empty is allowed
  
  // Check if it's a valid URL
  try {
    new URL(url);
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
  
  // Check if it's an image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  const isImageHost = [
    'imgur.com',
    'cloudinary.com', 
    'unsplash.com',
    'pexels.com',
    'cdn.',
    'images.',
    'assets.'
  ].some(host => url.toLowerCase().includes(host));
  
  if (!hasImageExtension && !isImageHost) {
    return { 
      isValid: false, 
      error: 'URL should point to an image file (.jpg, .png, etc.) or image hosting service' 
    };
  }
  
  return { isValid: true };
};

/**
 * Checks if a URL is valid for use with Next.js Image component
 * @param url - The URL to validate
 * @returns boolean - True if URL is valid for Image component
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Must start with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  
  // Must be a complete URL (basic check)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const formatBusinessHours = (hours: Record<string, { open: string; close: string; closed?: boolean }>) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const formatted: Record<string, { open: string; close: string; closed: boolean }> = {};
  
  days.forEach(day => {
    if (hours?.[day]) {
      formatted[day] = {
        open: hours[day].open || '09:00',
        close: hours[day].close || '18:00',
        closed: hours[day].closed || false
      };
    } else {
      formatted[day] = { open: '09:00', close: '18:00', closed: false };
    }
  });
  
  return formatted;
};
