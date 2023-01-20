import { Weight } from "../../pages/weights";
import { Unit } from "../../types/unit";
import { convertWeightIntoUnit } from "./unitConverter";

export const getBestHumanReadableUnit = (
  weight: Weight
): { value: number; unit: Unit } => {
  const weightValueInGram = weight.value;
  if (weightValueInGram >= 1e14)
    return convertWeightIntoUnit(weightValueInGram, "g", "Pg");
  if (weightValueInGram >= 1e11)
    return convertWeightIntoUnit(weightValueInGram, "g", "Tg");
  if (weightValueInGram >= 1e5)
    return convertWeightIntoUnit(weightValueInGram, "g", "Mg");
  if (weightValueInGram >= 1e2)
    return convertWeightIntoUnit(weightValueInGram, "g", "kg");
  if (weightValueInGram >= 1)
    return convertWeightIntoUnit(weightValueInGram, "g", "g");
  if (weightValueInGram >= 1e-2)
    return convertWeightIntoUnit(weightValueInGram, "g", "mg");
  if (weightValueInGram >= 1e-5)
    return convertWeightIntoUnit(weightValueInGram, "g", "µg");
  if (weightValueInGram >= 1e-8)
    return convertWeightIntoUnit(weightValueInGram, "g", "ng");
  return convertWeightIntoUnit(weightValueInGram, "g", "pg");
};
