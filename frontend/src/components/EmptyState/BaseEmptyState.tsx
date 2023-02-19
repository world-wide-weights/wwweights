import { Headline } from "../Headline/Headline"
import { Icon } from "../Icon/Icon"

type BaseEmptyStateProps = {
    /** Headline of empty state. */
    headline: string
    /** Description what to do and buttons for next action. */
    children: React.ReactNode
    /** Icon to display. */
    icon: string
    /** For testing. */
    datacy: string
}

/**
 * Base EmptyState Component, is used as a wrapper for empty states for example on search page no results.
 * @example <BaseEmptyState headline="No results found" icon="search" />
 */
export const BaseEmptyState: React.FC<BaseEmptyStateProps> = ({ headline, children, icon, datacy }) => {
    return <>
        <div datacy={datacy} className="flex flex-col items-center mt-10">
            {/* Icon */}
            <div className="flex items-center justify-center bg-blue-200 rounded-full w-16 h-16 min-w-[64px] md:w-20 md:h-20 md:min-w-[80px] mb-5">
                <Icon className="text-blue-700 text-4xl md:text-5xl" isFilled>{icon}</Icon>
            </div>

            {/* Content */}
            <Headline level={3} hasMargin={false}>{headline}</Headline>
            {children}
        </div>
    </>
}