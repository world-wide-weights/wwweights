export enum TagTypesEnum {
    red = 'red-500',
    purple = "indigo-500",
    pink = "pink-500",
    cyan = "cyan-500",
    blue = "blue-500",
    green = "emerald-500",
    yellow = "amber-500",
    grey = "gray-500",
}

type TagProps = {
    /** Content of tag */
    children: React.ReactNode

    /** href destination Link */
    link: String

    /** Possibility to change color and background of tag */
    type?: TagTypesEnum
}

/**
 * Tag
 */
export const Tag: React.FC<TagProps> = ({ children, link, type = TagTypesEnum.blue }) => {
    return (
        <a href={`${link}`} className={`inline-block bg-${type} bg-opacity-30 rounded-full px-5 py-1 mr-2 mb-2`}>{children}</a>
    )
}