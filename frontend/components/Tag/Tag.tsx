
export enum TagTypesEnum {
    red = 'red-600',
    purple = "indigo-500",
    pink = "pink-500",
    lightblue = "primary-blue-hover-icon",
    blue = "primary-blue",
    green = "emerald-500",
    yellow = "amber-500",
    lightgrey = "lightgrey",
    darkgrey = "darkgrey",
    dark = "gray-900",
}

type TagProps = {
    /** Content of tag */
    title: String

    /** href destination Link */
    link: String

    /** Possibility to change color and background of tag */
    type?: TagTypesEnum
}

/**
 * Tag
 */
export const Tag: React.FC<TagProps> = ({ title, link, type = TagTypesEnum.blue }) => {
    return (
        <a href="{link}" className="inline-block bg-${type} bg-opacity-20 text-${type} rounded-full px-5 py-1 mr-2 mb-2">{title}</a>
    )
}