/**
 * Generates a string of keywords separated by commas.
 * @param {string[]} keywords An array of keywords.
 * @returns {string} The generated string, a comma-separated list of keywords.
 */

export const generateKeywordString = (keywords: string[]): string => {
	return keywords.join(", ")
}
