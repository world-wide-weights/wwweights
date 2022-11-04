type TagProps = {
    /** Content of tag */
   children: React.ReactNode
}

/**
 * Chip
 */
export const Tag: React.FC<TagProps> = ({ children }) => {
    return (
        <p>{children}</p>
    )
}