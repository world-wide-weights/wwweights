// TODO (Zoe-bot): Adjust this to work with more units.
/**
 * Calculate the value for a weight in gram.
 * @param value the value we want to have in gram.
 * @param unit the current unit the value has.
 * @returns the value in gram.
 */
export const getWeightInG = (value: number, unit: "g" | "kg" | "t"): number => {
    if (unit === "g")
        return value

    return unit === "kg" ? value * 1000 : value * 1e+6
}