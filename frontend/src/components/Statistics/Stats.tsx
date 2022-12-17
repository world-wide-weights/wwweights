import { Icon } from "../Icon/Icon"

type StatsProps = {
    icon: string
    descriptionTop?: string
    value: string
    descriptionBottom?: string
}

export const Stats: React.FC<StatsProps> = ({ icon, descriptionTop, value, descriptionBottom }) => {
    return <div className="flex items-center bg-white rounded-lg p-6">
        <div className="flex items-center justify-center bg-blue-500 bg-opacity-20 rounded-full w-16 h-16 mr-6">
            <Icon className="text-blue-700 text-3xl" isFilled>{icon}</Icon>
        </div>
        <div>
            {descriptionTop && <span className="font-semibold text-grey-600 ">{descriptionTop}</span>}
            <h5 className="font-bold text-2xl leading-6">{value}</h5>
            {descriptionBottom && <p className="text-grey-700">{descriptionBottom}</p>}
        </div>
    </div >
}