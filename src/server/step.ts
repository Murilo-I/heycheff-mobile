import api from "./api";
import { EnProduct, Product } from "./product";
import { baseUrl } from "./recipe";

export type Step = {
    path: string
    stepNumber: number
    produtos: Product[]
    modoPreparo: string
    timeMinutes: number
}

export type StepRequest = Step & {
    video: Blob
    recipeId: number
}

export type StepResponse = {
    stepId: number
    path: string
    stepNumber: number
    products: EnProduct[]
    preparationMode: string
    timeMinutes: number
}

const partUrl = '/steps';

async function saveStep(step: StepRequest) {
    const formData = new FormData();
    formData.append('stepNumber', step.stepNumber.toString());
    formData.append('produtos', JSON.stringify(step.produtos));
    formData.append('modoPreparo', step.modoPreparo);
    formData.append('timeMinutes', step.timeMinutes.toString());
    formData.append('video', step.video);

    try {
        return await api.post<StepResponse>(`${baseUrl}/${step.recipeId}${partUrl}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (error) {
        throw error;
    }
}

async function deleteStep(stepNumber: number, recipeId: number) {
    try {
        return await api.delete(`${baseUrl}/${recipeId}${partUrl}/${stepNumber}`);
    } catch (error) {
        console.log("Could not delete step: ", error);
    }
}

async function updateStep(step: StepRequest) {
    const formData = new FormData();
    formData.append('stepNumber', step.stepNumber.toString());
    formData.append('produtos', JSON.stringify(step.produtos));
    formData.append('modoPreparo', step.modoPreparo);
    formData.append('timeMinutes', step.timeMinutes.toString());
    formData.append('video', step.video);

    try {
        return await api.patch<StepResponse>(`${baseUrl}/${step.recipeId}${partUrl}/${step.stepNumber}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (error) {
        throw error;
    }
}

export const stepServer = { saveStep, deleteStep, updateStep }