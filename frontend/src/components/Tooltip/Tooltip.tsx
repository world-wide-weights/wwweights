import { useState } from "react"

type TooltipProps = {
    /** Tooltip content for example a text. */
    content: React.ReactNode
    /** Content when you hover, tooltip is shown. */
    children: React.ReactNode
    /** Position where tooltip is displayed. */
    position?: "top" | "right" | "bottom" | "left"
    /** Time when the tooltip is displayed. */
    delay?: number
    /** Adjust margin for top and left position when tooltip gets bigger. */
    customMargin?: string
    /** Add custom classname to tooltip wrapper. */
    wrapperClassname?: string
}

/**
 * Wrap around Component and show tooltip when hover over it.
 */
export const Tooltip: React.FC<TooltipProps> = ({ children, content, delay, wrapperClassname = "", position = "top", customMargin = "-40px" }) => {
    let timeout: NodeJS.Timeout
    const [isShown, setIsShown] = useState(false)

    /**
     * Shows Tooltip
     */
    const showTooltip = () => {
        timeout = setTimeout(() => {
            setIsShown(true)
        }, delay || 0)
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
    const tooltipClassesPosition = {
        ["top"]: "before:top-full before:border-t-blue-900",
        ["right"]: "left-[calc(100%_+_30px)] top-1/2 translate-x-0 -translate-y-1/2 before:left-[-8px] before:top-1/2 before:translate-x-0 before:-translate-y-1/2 before:border-r-blue-900",
        ["bottom"]: "before:bottom-full before:border-b-blue-900",
        ["left"]: "left-auto right-[calc(100%_+_30px)] top-1/2 translate-x-0 -translate-y-1/2 before:left-auto before:right-[-16px] before:top-1/2 before:translate-x-0 before:-translate-y-1/2 before:border-l-blue-900",
    }

    return <div datacy="tooltip-wrapper" className={`relative inline-block ${wrapperClassname}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} >
        {children}
        {
            isShown && <div datacy="tooltip" style={position == "top" ? { top: customMargin } : position == "bottom" ? { bottom: customMargin } : {}} className={`${baseClass} ${triangleBaseClass} ${tooltipClassesPosition[position]}`}>
                {content}
            </div>
        }
    </div >
}