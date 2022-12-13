type IconProps = {
    /** The icon to show */
    children: string
    /** Custom classes */
    className?: string
}

export const Icon: React.FC<IconProps> = ({ children, className }) => <i className={`material-symbols-rounded ${className}`}>{children}</i>