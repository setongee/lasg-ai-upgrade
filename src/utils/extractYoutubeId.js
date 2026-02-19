/**
 * Extracts the YouTube video ID from a YouTube URL or returns the input if it's not a YouTube URL
 * 
 * @param {string} input - The YouTube URL or video ID
 * @returns {string} The extracted video ID or the original input if not a YouTube URL
 */
const extractYoutubeId = (input) => {
  if (!input || typeof input !== 'string') return input || '';
  
  // If it's a YouTube URL, extract the ID
  if (isYoutubeUrl(input)) {
    // Handle youtu.be/ID format
    const shortUrlMatch = input.match(/(?:youtu\.be\/|youtube\.com\/embed\/)([^#\&\?\/]+)/);
    if (shortUrlMatch && shortUrlMatch[1]) {
      return shortUrlMatch[1];
    }

    // Handle youtube.com/watch?v=ID format
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = input.match(regExp);
    
    if (match && match[2]?.length === 11) {
      return match[2];
    }
  }
  
  // Return the original input if it's not a YouTube URL or if extraction failed
  return input;
};

/**
 * Checks if a given string is a YouTube URL
 * @param {string} url - The URL to check
 * @returns {boolean} True if it's a YouTube URL, false otherwise
 */
const isYoutubeUrl = (url) => {
  if (!url) return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
};

export default extractYoutubeId;
