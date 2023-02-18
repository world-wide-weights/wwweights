import { ReactElement } from "react"
import { Button } from "../Button/Button"
import { Chip } from "../Chip/Chip"
import { TabProps } from "./Tab"

type TabsProps = {
    /** Tab children. Should contain one or more `Tab` components. */
    children: ReactElement<TabProps>[]
    /** Index of selected tab get from url and findIndex. */
    selectedTabIndex: number
}

/**
 * Tabs Container for Tab.
 * @example
 * ```jsx
 * <Tabs>
 *  <Tab title="Test 1" link={routes.test({ tab: test1 })}>
 *     <p>Test 1 Content</p> 
 *  </Tab>
 *  <Tab tab="Test 2" link={routes.test({ tab: test2 })}>
 *     <p>Test 2 Content</p> 
 *  </Tab>
 * </Tabs>
 * ```
 */
export const Tabs: React.FC<TabsProps> = ({ children, selectedTabIndex }) => {
    return <div>
        <div className="flex flex-wrap items-center">
            {/* Tab Buttons */}
            {children.map(({ props: { title, link } }, index) => (
                selectedTabIndex === index ? <Chip datacy={`tab-chip-${index}`} disabled dimOpacityWhenDisabled={false} to={link} key={index}>{title}</Chip> : <Button datacy={`tab-link-${index}`} key={index} to={link} kind="tertiary" className="px-5 py-1 mr-2 mb-2" shallow={true}>{title}</Button>
            ))}
        </div>

        {/* Selected Tab Content */}
        {children[selectedTabIndex]}
    </div>
}