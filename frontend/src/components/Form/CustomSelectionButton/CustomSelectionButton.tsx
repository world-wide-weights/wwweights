import { Icon } from "../../Icon/Icon"

type CustomSelectionButtonProps = {
    active: boolean
    onClick: () => void
    headline: string
    description: string
}

export const CustomSelectionButton: React.FC<CustomSelectionButtonProps> = ({ active, onClick, headline, description }) => {
    return <button type="button" onClick={onClick} disabled={active} className={`flex items-center flex-col border-2 transition duration-200 ease-in-out ${active ? "border-blue-500 " : "border-gray-100"} bg-gray-100 rounded-lg pt-1 pb-3 px-4`}>
        {active && <Icon className="text-blue-500 h-4 ml-auto">check</Icon>}
        <h6 className={`${active ? "text-blue-500" : "pt-4"} mt-1 md:mt-0 font-medium`}>{headline}</h6>
        <p className="text-gray-600">{description}</p>
    </button>

}