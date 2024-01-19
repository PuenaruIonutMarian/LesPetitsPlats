/**
 * Cleans the string by removing accents and converting to lowercase.
 * @param {string} str - The input string to be cleaned.
 * @returns {string} - The cleaned string.
 */
export const cleanString = (str) => {
    // Check if the input is a string
  if (typeof str !== 'string') {
    return '';
  }

    // Convert to lowercase, normalize accents, and remove them
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};
