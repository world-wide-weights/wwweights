
/**
 * Skeleton Loading for edit page.
 */
export const SkeletonLoadingEdit: React.FC = () => {
    return <main datacy="skeleton-loading" className="mt-5 mb-5 md:mb-20">
        <div className="container">
            {/* Headline */}
            <div className="bg-slate-200 animate-pulse h-6 w-32 mb-2"></div>
        </div>

        {/* Content */}
        <div className="container">
            {/*** General Information ***/}
            <div className="bg-white rounded-lg p-6 mb-4">
                <div className="lg:w-3/4 2xl:w-1/2">
                    {/* Name */}
                    <div className="bg-slate-100 animate-pulse h-5 w-32 mb-2"></div>
                    <div className="bg-slate-100 animate-pulse h-10 w-full mb-2 md:mb-4"></div>

                    {/* Weight */}
                    <div className="bg-slate-100 animate-pulse h-5 w-32 mb-2"></div>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="bg-slate-100 animate-pulse h-20 w-full mb-2 md:mb-4"></div>
                        <div className="bg-slate-100 animate-pulse h-20 w-full mb-2 md:mb-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
                        {/** Exact Value **/}
                        <div className="min-w-0">
                            <div className="bg-slate-100 animate-pulse h-5 w-32 mb-2"></div>
                            <div className="bg-slate-100 animate-pulse h-10 w-full mb-2 md:mb-4"></div>
                        </div>

                        {/** Unit **/}
                        <div>
                            <div className="bg-slate-100 animate-pulse h-5 w-32 mb-2"></div>
                            <div className="bg-slate-100 animate-pulse h-10 w-full mb-2 md:mb-4"></div>
                        </div>
                    </div>
                </div>

                {/* Is circa */}
                <div className="flex items-center">
                    <div className="bg-slate-100 animate-pulse h-5 w-32 mb-2"></div>
                </div>
            </div>

            {/*** Details ***/}
            <div className="bg-white rounded-lg p-6 mb-4">
                {/* Details Header */}
                <div datacy="create-open-details-button" className="flex items-center justify-between cursor-pointer">
                    <div>
                        <div className="bg-slate-200 animate-pulse h-6 w-32 mb-2"></div>
                        <div className="bg-slate-100 animate-pulse h-5 w-48 md:w-96 mb-2"></div>
                    </div>
                    <div className="bg-slate-200 animate-pulse h-12 w-12 rounded-full"></div>
                </div>
            </div>
        </div>

        {/*** Actions Text Mobile ***/}
        <div className="container">
            <div className="block sm:hidden bg-slate-200 animate-pulse h-5 w-52 md:w-96 mb-2"></div>
        </div>

        {/*** Actions ***/}
        <div className="sm:container">
            <div className="fixed w-full sm:static bottom-0 lg:flex items-center justify-between bg-white border-t border-gray-100 sm:rounded-lg py-6 px-5">
                <div className="hidden sm:block bg-slate-100 animate-pulse h-5 w-32 md:w-96"></div>
                <div className="flex gap-3 items-center">
                    <div className="bg-slate-200 animate-pulse h-[42px] w-28 rounded-full"></div>
                    <div className="bg-slate-300 animate-pulse h-[42px] w-28 rounded-full"></div>
                </div>
            </div>
        </div>
    </main >
}