type IconProps = {
    /** The icon to show */
    children: string
    /** Fill icons */
    isFilled?: boolean
    /** Custom classes */
    className?: string
}

export const Icon: React.FC<IconProps> = ({ children, isFilled = false, className }) => <i style={isFilled ? {
    fontVariationSettings: "'FILL' 1"
} : {}} className={`material-symbols-rounded ${className}`}>{children}</i>