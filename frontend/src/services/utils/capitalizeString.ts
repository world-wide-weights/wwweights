/**
 * Capitalize the first letter of a string.
 * @param string we want to have first letter caps.
 * @returns the capitalized string.
 */
export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
