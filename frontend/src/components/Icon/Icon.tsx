type IconProps = {
    /** The icon to show */
    children: string
    /** Fill icons */
    isFilled?: boolean
    /** Custom classes */
    className?: string
    /** For testing */
    datacy?: string
}

export const Icon: React.FC<IconProps> = ({ children, isFilled = false, datacy, className }) => <i datacy={datacy} style={isFilled ? {
    fontVariationSettings: "'FILL' 1"
} : {}} className={`material-symbols-rounded ${className}`}>{children}</i>