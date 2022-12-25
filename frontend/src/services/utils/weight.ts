import { Weight } from "../../pages/weights"

export const generateWeightString = (weight: Weight) => {
    return `${weight.isCa ? "ca. " : ""}${weight.value}${weight.aditionalValue ? `-${weight.aditionalValue}` : ""} g`
}