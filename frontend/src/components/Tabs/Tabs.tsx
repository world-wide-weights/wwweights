import { ReactElement } from "react"
import { Button } from "../Button/Button"
import { Chip } from "../Chip/Chip"
import { TabProps } from "./Tab"

type TabsProps = {
    /** Tab childrens. Need to be more than one otherwise don't need to use tab component. */
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
        <div className="flex items-center">
            {children.map(({ props: { title, link } }, index) => (
                selectedTabIndex === index ? <Chip disabled dimOpacityWhenDisabled={false} to={link} key={index}>{title}</Chip> : <Button key={index} to={link} kind="tertiary" className="px-5 mr-2 mb-2">{title}</Button>
            ))}
        </div>
        {children[selectedTabIndex]}
    </div>
}