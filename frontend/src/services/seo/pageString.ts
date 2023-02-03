/**
 * Generates a string indicating the current page number.
 * @param {number} currentPage The current page number.
 * @returns {string} The generated string, either "| Page {currentPage}" or an empty string if the current page is 1.
 */
export const generatePageString = (currentPage: number): string => {
    return `${currentPage > 1 ? `| Page ${currentPage}` : ""}`
}