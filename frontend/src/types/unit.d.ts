export type Unit = "ag" | "fg" | "pg" | "ng" | "µg" | "mg" | "g" | "kg" | "T" | "Tg" | "Pg" | "Eg" | "Zg" | "Yg" | "Rg" | "Qg"

export type WeightWithUnit = { 
    value: number,
    unit: Unit 
}