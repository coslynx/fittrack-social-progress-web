import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats a date string into "MM/DD/YYYY" format.
 * @param {string} dateString - The date string in ISO format (e.g., "2024-03-15T10:00:00Z").
 * @returns {string|null} - The formatted date string or null if the input is invalid.
 */
function formatDate(dateString) {
    // Check if the input is a valid date string
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
        return null;
    }

    try {
        // Parse the ISO date string into a Date object
        const parsedDate = parseISO(dateString);

        // Validate parsed date
        if (!isValid(parsedDate)) {
            return null;
        }
        // Format the Date object into MM/DD/YYYY
        return format(parsedDate, 'MM/dd/yyyy');
    } catch (error) {
        // Handle any parsing errors, log, and return null
         console.error('Error parsing date string:', error);
        return null;
    }
}

/**
 * Sanitizes a string by removing potentially dangerous characters.
 * @param {string} inputString - The string to sanitize.
 * @returns {string} - The sanitized string. If the input is not a string, returns an empty string.
 */
function sanitizeInput(inputString) {
    // Check if the input is a string
     if (typeof inputString !== 'string') {
          return '';
      }
  
    // Use a regular expression to remove potentially harmful characters
    const sanitizedString = inputString.replace(/[<>"'&--]/g, '');
    
    // Trim the sanitized string and return it.
    return sanitizedString.trim();
}

/**
 * Trims a string input.
 * @param {string} input - The string to trim.
 * @returns {string} - The trimmed string. Returns an empty string if the input is not a string.
 */
function trimInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return input.trim();
}

export { formatDate, sanitizeInput, trimInput };