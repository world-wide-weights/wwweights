export type TabProps = {
    /** Tab title. */
    title: string
    /** Link to this tab with all other options. */
    link: string
    /** Tab Content */
    children: React.ReactNode
}

/**
 * Tab needs to be wrapped inside of Tabs
 * @example
 * ```jsx
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
    return <div {...props}>{children}</div>
}