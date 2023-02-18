import { ItemSourceProps } from "../../components/Item/ItemSource"

/**
 * Generate a source string for the item source component
 */
export const generateSourceString = ({ name, source, weightString }: ItemSourceProps): {
    sourceString: string
    isUrl: boolean
} => {

    try {
        const sourceName = new URL(source).hostname.replace("www.", "")
        const sourceString = `According to ${sourceName}, ${name} weights ${weightString}.`
        return {
            sourceString,
            isUrl: true
        }
    } catch (error) {
        const sourceString = `According to ${source}, ${name} weights ${weightString}.`
        return {
            sourceString,
            isUrl: false
        }
    }
}