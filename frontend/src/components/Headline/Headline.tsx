import React from 'react';

type HeadlineProps = {
    /** Content of Headline */
    children: React.ReactNode
    /** Specifies if its an h1, h2, h3,... */
    level?: 1 | 2 | 3 | 4 | 5 | 6
    /** Customize size. Is also set with level. */
    size?: string
    /** If true adds margin */
    hasMargin?: boolean
    /** Custom classname */
    className?: string
}

/** Defines the classes for each size level */
export const textSizes: { [K in Required<HeadlineProps>["level"]]: string } = {
    1: "text-xl md:text-2xl",
    2: "text-xl md:text-xl",
    3: "text-xl md:text-xl",
    4: "text-lg md:text-xl",
    5: "text-base md:text-lg",
    6: ""
}

/**
 * Custom Headline Component, to easy handle headlines with different level and adjustive styles
 */
export const Headline: React.FC<HeadlineProps> = ({ level = 1, children, size, hasMargin = true, className = "" }) => {
    const CustomTag = `h${level}` as keyof JSX.IntrinsicElements

    return (
        <CustomTag className={`${size ?? textSizes[level]} font-bold ${hasMargin ? "mb-2 md:mb-4" : ""} ${className}`}>{children}</CustomTag>
    )
}