/**
 * Converts an underscored string to title case
 * @param {string} str - The string to convert (e.g., 'hero_section')
 * @returns {string} The title-cased string (e.g., 'Hero Section')
 */
export const toTitleCase = (str) => {
  if (!str) return '';

  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Example usage:
// toTitleCase('hero_section') => 'Hero Section'
// toTitleCase('quick_services') => 'Quick Services'
// toTitleCase('youtube_section') => 'Youtube Section'
