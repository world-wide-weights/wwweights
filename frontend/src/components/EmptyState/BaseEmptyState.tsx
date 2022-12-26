import { Headline } from "../Headline/Headline"
import { Icon } from "../Icon/Icon"

type BaseEmptyStateProps = {
    /** Headline of empty state. */
    headline: string
    /** Description what to do and buttons for next action. */
    children: React.ReactNode
}

/**
 * Base EmptyState Component, is used as a wrapper for empty states for example on search page no results.
 */
export const BaseEmptyState: React.FC<BaseEmptyStateProps> = ({ headline, children }) => {
    return <>
        <div className="flex flex-col items-center mt-10">
            <div className="flex items-center justify-center bg-blue-200 rounded-full w-16 h-16 min-w-[64px] md:w-20 md:h-20 md:min-w-[80px] mb-5">
                <Icon className="text-blue-700 text-4xl md:text-5xl" isFilled>weight</Icon>
            </div>
            <Headline level={3}>{headline}</Headline>
            {children}
        </div>
    </>
}