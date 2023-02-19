
export type TabProps = {
    /** Title is the text displayed on the tab button. */
    title: string
    /** Link is the URL that the tab button navigates to. */
    link: string
    /** Children is the content that is displayed when the tab is active. */
    children: React.ReactNode
}

/**
 * The `Tab` component is used to create a single tab within a set of tabs. 
 * It should be wrapped inside of the `Tabs` component for proper functionality. 
 * @example
 * ```tsx
 * <Tabs>
 *  <Tab tab="Test 1" link={routes.test({ tab: test1 })}>
 *     <p>Test 1 Content</p> 
 *  </Tab>
 *  <Tab tab="Test 2" link={routes.test({ tab: test2 })}>
 *     <p>Test 2 Content</p> 
 *  </Tab>
 * </Tabs>
 * ```
 */
export const Tab: React.FC<TabProps> = ({ children, title, link, ...props }) => {
    return <div className="mt-2" {...props}>{children}</div>
}