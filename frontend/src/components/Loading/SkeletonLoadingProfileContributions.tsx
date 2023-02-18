
const ITEM_LIST_COUNT = 3
const PAGINATION_COUNT = 4

/**
 * Skeleton Loading for Profile page.
 */
export const SkeletonLoadingProfileContributions: React.FC = () => {
    return <div className="lg:w-3/4">
        <div className="bg-slate-200 animate-pulse h-7 w-32 mb-2"></div>
        <ul className="mb-10">
            {new Array(ITEM_LIST_COUNT).fill(0).map((_, index) => <li key={index} className="bg-white rounded-lg py-4 px-2 md:py-2 mb-2">
                <div className="flex justify-between">
                    {/* Item name, weight and image */}
                    <div className="flex justify-between md:justify-start items-center w-full md:h-12 mx-2 md:mx-4">
                        <div className="md:flex">
                            <div className="bg-slate-100 animate-pulse h-5 w-28 md:w-52 pr-3 mr-12 mb-2 md:mb-0"></div>
                            <div className="bg-slate-100 animate-pulse h-5 md:w-32 mr-5"></div>
                        </div>
                        <div className="bg-slate-100 animate-pulse h-14 w-14 rounded-lg"></div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center mx-0 sm:mx-3">
                        <div className="bg-slate-100 animate-pulse h-10 w-10 rounded-full mr-1 md:mr-3"></div>
                        <div className="bg-slate-100 animate-pulse h-10 w-10 rounded-full"></div>
                    </div>
                </div>
            </li>)}
        </ul>

        {/* Pagination */}
        <ul className="flex items-center justify-center">
            <li className="bg-slate-200 animate-pulse h-6 w-20 mr-3" />
            {new Array(PAGINATION_COUNT).fill(0).map((_, index) =>
                <li className="bg-slate-200 animate-pulse flex justify-center items-center rounded-full w-9 h-9 ml-2" key={index} />
            )}
            <li className="bg-slate-200 animate-pulse h-6 w-20 ml-4" />
        </ul>
    </div>
}