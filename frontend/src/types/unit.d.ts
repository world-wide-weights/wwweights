export type Unit = "pg" | "ng" | "µg" | "mg" | "g" | "kg" | "Mg" | "Tg" | "Pg"

export type WeightWithUnit = { value: number; unit: Unit }