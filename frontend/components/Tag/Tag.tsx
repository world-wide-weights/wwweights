export enum TagTypesEnum {
    red = 'red-500',
    purple = "indigo-500",
    pink = "pink-500",
    cyan = "cyan-500",
    blue = "blue-500",
    green = "emerald-500",
    yellow = "amber-500",
    lightgrey = "gray-500",
    darkgrey = "gray-800",
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
        <a href="{link}" className="inline-block bg-${type} bg-opacity-20 rounded-full px-5 py-1 mr-2 mb-2">{title}</a>
    )
}