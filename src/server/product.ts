import api from "./api"

export type Product = {
    desc: string
    unidMedida: string
    medida: number
}

export type EnProduct = {
    description: string
    measureUnit: string
    quantity: number
}

export type UnitMeasure = {
    descricao: string
}

const baseUrl = "/produtos";

async function getMeasures() {
    try {
        return await api.get<UnitMeasure[]>(`${baseUrl}/0/medidas`)
            .then(resp => resp.data);
    } catch (error) {
        console.log("Could not load measures: ", error);
    }
}

export const productServer = { getMeasures }