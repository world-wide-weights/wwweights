export type TabProps = {
    /** Tab with title and slug */
    tab: TabType
    /** Link to this tab with all other options. */
    link: string
    /** Tab Content */
    children: React.ReactNode
}

export type TabType = {
    title: string
    slug: string
    content?: React.ReactNode
}

/**
 * Tab needs to be wrapped inside of Tabs
 * @example
 * ```jsx
 * <Tabs>
 *  <Tab tab={{ title: "Test 1", slug: "test1" }} link={routes.test({ tab: test1 })}>
 *     <p>Test 1 Content</p> 
 *  </Tab>
 *  <Tab tab={{ title: "Test 2", slug: "test2" }} link={routes.test({ tab: test2 })}>
 *     <p>Test 2 Content</p> 
 *  </Tab>
 * </Tabs>
 * ```
 */
export const Tab: React.FC<TabProps> = ({ children, tab, link, ...props }) => {
    return <div {...props}>{children}</div>
}