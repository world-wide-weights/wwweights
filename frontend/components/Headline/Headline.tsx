import React from 'react';

type HeadlineProps = {
    /** Content of Headline */
    children: React.ReactNode
    /** Specifies if its an h1, h2, h3,... */
    level?: 1 | 2 | 3 | 4 | 5 | 6
    /** If true adds margin */
    hasMargin?: boolean
}

export const Headline: React.FC<HeadlineProps> = ({ level = 1, children, hasMargin = true }) => {
    const CustomTag = `h${level}` as keyof JSX.IntrinsicElements

    return (
        <CustomTag className={`text-2xl md:text-xl font-semibold ${hasMargin ? "mb-2 md:mb-4" : ""}`}>{children}</CustomTag>
    )
}