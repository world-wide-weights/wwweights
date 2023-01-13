
export type ProgressBarProps = {
    /** The progress in percent */
    progress: number
    /** When this is set there is a range showing */
    progressAdditional?: number
    /** When this is set the progress bar is a gradient */
    isCa?: boolean
}

/**
 * Progress bar, can show range and ca.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, progressAdditional = false, isCa = false }) => {
    return <div className="relative bg-gray-200 rounded-lg h-2 w-[100%]">
        {/* Additional Progress */}
        {progressAdditional && <div datacy="progressbar-additional-progress" style={{
            width: progressAdditional > 100 ? "100%" : `${progressAdditional}%` // Use style instead of tailwind arbitary values because otherwise need to create safelist for 100 classes
        }} className={`absolute bg-blue-300 rounded-lg h-2`} />}

        {/* Progress */}
        <div datacy="progressbar-progress" style={{
            width: progress > 100 ? "100%" : `${progress}%` // Use style instead of tailwind arbitary values because otherwise need to create safelist for 100 classes
        }} className={`absolute ${isCa ? "bg-gradient-to-r from-blue-600 to-blue-400" : "bg-blue-600"} rounded-lg h-2`} />
    </div>
}