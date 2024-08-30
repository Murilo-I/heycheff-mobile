import { Product } from "./product";

export type Step = {
    path: string
    stepNumber: number
    produtos: Product[]
    modoPreparo: string
}