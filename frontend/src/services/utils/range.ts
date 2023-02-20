/**
 * Gets an array of numbers from start to end (inclusive)
 * @param start index
 * @param end index inclusive
 * @returns array of numbers
 */
export const range = (start: number, end: number) => {
	const length = end - start + 1
	return Array.from({ length }, (_, i) => i + start)
}
