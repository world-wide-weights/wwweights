import BigNumber from "bignumber.js";
import { Weight } from "../../pages/weights";
import { Unit } from "../../types/unit";

export const getBestHumanReadableUnit = (
  weight: Weight
): { value: BigNumber; unit: Unit } => {
  const weightValueInGram = weight.value;
  const valueAsBigNumber = new BigNumber(weightValueInGram);
  if (weightValueInGram >= 1e14)
    return { value: weightValueInGram / 1e14, unit: "Gt" };
  if (weightValueInGram >= 1e11)
    return { value: weightValueInGram / 1e12, unit: "Mt" };
  if (weightValueInGram >= 1e5)
    return { value: weightValueInGram / 1e6, unit: "t" };
  if (weightValueInGram >= 1e2)
    return { value: weightValueInGram / 1e3, unit: "kg" };
  if (weightValueInGram >= 1) return { value: weightValueInGram, unit: "g" };
  if (weightValueInGram >= 1e-2)
    return { value: weightValueInGram / 1e-3, unit: "mg" };
  if (weightValueInGram >= 1e-5)
    return { value: weightValueInGram / 1e-6, unit: "µg" };
  if (weightValueInGram >= 1e-8)
    return { value: weightValueInGram / 1e-9, unit: "ng" };
  return { value: weightValueInGram / 1e-12, unit: "pg" };
};
