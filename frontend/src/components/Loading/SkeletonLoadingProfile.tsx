import { SkeletonLoadingProfileContributions } from "./SkeletonLoadingProfileContributions"

const STATISTICS_ELEMENT_COUNT = 4

/**
 * Skeleton Loading for Profile page.
 */
export const SkeletonLoadingProfile: React.FC = () => {
	return (
		<main datacy="skeleton-loading" className="container mt-5">
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
						{new Array(STATISTICS_ELEMENT_COUNT).fill(0).map((_, index) => (
							<div key={index} className="flex items-center bg-white h-20 rounded-lg mb-2">
								<div className="bg-blue-100 animate-pulse h-14 w-14 rounded-full ml-7 mr-4"></div>
								<div>
									<div className="bg-slate-100 animate-pulse h-4 w-24 mb-2"></div>
									<div className="bg-slate-100 animate-pulse h-5 w-16"></div>
								</div>
							</div>
						))}
					</div>
				</div>

				<SkeletonLoadingProfileContributions />
			</div>
		</main>
	)
}
