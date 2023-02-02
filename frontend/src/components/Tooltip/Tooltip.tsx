import { useState } from "react"

type TooltipProps = {
    /** Tooltip content for example a text. */
    content: React.ReactNode
    /** Content when you hover, tooltip is shown. */
    children: React.ReactNode
    /** Position where tooltip is displayed. */
    direction?: "top" | "right" | "bottom" | "left"
    /** Time when the tooltip is displayed. */
    delay?: number
    /** Adjust margin for top and left position when tooltip gets bigger. */
    customMargin?: string
}

/**
 * Wrap around Component and show tooltip when hover over it.
 */
export const Tooltip: React.FC<TooltipProps> = ({ children, content, delay, direction = "top", customMargin = "-40px" }) => {
    let timeout: NodeJS.Timeout
    const [isShown, setIsShown] = useState(true)

    /**
     * Shows Tooltip
     */
    const showTooltip = () => {
        timeout = setTimeout(() => {
            setIsShown(true)
        }, delay || 400)
    }

    /**
     * Hide Tooltip
     */
    const hideTooltip = () => {
        clearInterval(timeout)
        setIsShown(false)
    }

    // CSS Classes
    const baseClass = "absolute bg-blue-900 text-white text-sm text-center rounded-md left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-4 py-2"
    const triangleBaseClass = "before:content-[' '] before:left-1/2 before:h-0 before:w-0 before:absolute before:border-transparent before:border-solid before:border-[8px] before:ml-[-8px]"
    const tooltipClassesDirection = {
        ["top"]: "before:top-full before:border-t-blue-900",
        ["right"]: "left-[calc(100%_+_30px)] top-1/2 translate-x-0 -translate-y-1/2 before:left-[-8px] before:top-1/2 before:translate-x-0 before:-translate-y-1/2 before:border-r-blue-900",
        ["bottom"]: "before:bottom-full before:border-b-blue-900",
        ["left"]: "left-auto right-[calc(100%_+_30px)] top-1/2 translate-x-0 -translate-y-1/2 before:left-auto before:right-[-16px] before:top-1/2 before:translate-x-0 before:-translate-y-1/2 before:border-l-blue-900",
    }

    return <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        {children}
        {isShown && <div style={direction == "top" ? { top: customMargin } : direction == "bottom" ? { bottom: customMargin } : {}} className={`${baseClass} ${triangleBaseClass} ${tooltipClassesDirection[direction]}`}>
            {content}
        </div>}
    </div>
}