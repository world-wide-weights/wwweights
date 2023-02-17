/**
 * Skeleton Loading for Profile page.
 */
export const SkeletonLoadingProfile: React.FC = () => {
    return <main datacy="skeleton-loading" className="container mt-5">
        <div className="bg-slate-200 animate-pulse h-6 w-32 mb-2 md:mb-4"></div>
        <div className="lg:flex gap-4">
            <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-6 lg:mb-0">
                {/* Meta infos */}
                <div className="bg-white flex flex-col justify-center md:justify-start sm:w-1/2 md:w-auto items-center rounded-lg py-6 px-4 mb-3 sm:mb-0">
                    <div className="bg-blue-100 animate-pulse h-28 w-28 rounded-full mb-2"></div>
                    <div className="bg-slate-100 animate-pulse h-6 w-32 mb-2"></div>
                    <div className="bg-slate-100 animate-pulse h-5 w-52 mb-2"></div>
                </div>

                {/* Statistics */}
                <div className="flex flex-col gap-3 flex-grow">
                    {new Array(4).fill(0).map((_, index) =>
                        <div key={index} className="flex items-center bg-white h-20 rounded-lg mb-2">
                            <div className="bg-blue-100 animate-pulse h-14 w-14 rounded-full ml-7 mr-4"></div>
                            <div>
                                <div className="bg-slate-100 animate-pulse h-4 w-24 mb-2"></div>
                                <div className="bg-slate-100 animate-pulse h-5 w-16"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contributions */}
            <div className="lg:w-3/4">
                <div className="bg-slate-200 animate-pulse h-7 w-32 mb-2"></div>
                <ul className="mb-10">
                    {new Array(3).fill(0).map((_, index) => <li key={index} className="bg-white rounded-lg py-4 px-2 md:py-2 mb-2">
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
                    {new Array(4).fill(0).map((_, index) =>
                        <li className="bg-slate-200 animate-pulse flex justify-center items-center rounded-full w-9 h-9 ml-2" key={index} />
                    )}
                    <li className="bg-slate-200 animate-pulse h-6 w-20 ml-4" />
                </ul>
            </div>
        </div>
    </main>
}