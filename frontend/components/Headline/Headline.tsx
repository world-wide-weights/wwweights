import React from 'react';

type HeadlineProps = {
    /** Content of Headline */
    children: React.ReactNode
    /** Specifies if its an h1, h2, h3,... */
    level?: 1 | 2 | 3 | 4 | 5 | 6
    /** If true adds margin */
    hasMargin?: boolean
}

/**
 * Custom Headline Component, to easy handle headlines with different level and adjustive styles
 */
export const Headline: React.FC<HeadlineProps> = ({ level = 1, children, hasMargin = true }) => {
    const CustomTag = `h${level}` as keyof JSX.IntrinsicElements

    // Generate text size class depending on level
    let textSize = ""
    switch (level) {
        case 1:
            textSize = "text-3xl md:text-4xl"
            break
        case 2:
            textSize = "text-2xl md:text-3xl"
            break
        case 3:
            textSize = "text-xl md:text-2xl"
            break
        case 4:
            textSize = "text-lg md:text-xl"
            break
        case 5:
            textSize = "text-base md:text-lg"
            break
        case 6:
            textSize = ""
    }

    return (
        <CustomTag className={`${textSize} font-semibold ${hasMargin ? "mb-2 md:mb-4" : ""}`}>{children}</CustomTag>
    )
}