
export type ProgressBarProps = {
    /** The progress in percent */
    progress: number
}

/**
 * Progress bar
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return <div className="relative bg-gray-200 rounded-lg h-2 w-[100%]">
        <div style={{
            width: progress > 100 ? "100%" : `${progress}%` // Use style instead of tailwind arbitary values because otherwise need to create safelist for 100 classes
        }} className={`absolute bg-blue-500 rounded-lg h-2`} />
    </div>
}