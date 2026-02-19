/**
 * Extracts all image file objects from a nested object
 * @param {Object} obj - The object to search for image files
 * @returns {Array} - Array of { path: string, file: File } objects
 */
export const extractImageFiles = (obj, path = '') => {
  const files = [];
  
  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    const value = obj[key];
    
    if (value instanceof File) {
      files.push({ path: currentPath, file: value });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      files.push(...extractImageFiles(value, currentPath));
    }
  }
  
  return files;
};

/**
 * Updates an object with new values using a path string
 * @param {Object} obj - The object to update
 * @param {string} path - Path string (e.g., 'heroSection.backgroundImage')
 * @param {*} value - New value to set
 */
export const updateObjectByPath = (obj, path, value) => {
  const keys = path.split('.');
  let current = { ...obj };
  const result = current;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};
