import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { StepRequest } from "@/server/step";
import { RootState } from "../store";

const initialState: StepRequest = {
    path: '',
    thumbVideo: '',
    modoPreparo: '',
    produtos: [],
    video: { uri: '', name: '', type: '' },
    recipeId: 0,
    stepNumber: 0,
    timeMinutes: 0
}

export const stepSlice = createSlice({
    name: 'currentStep',
    initialState,
    reducers: {
        setCurrentStep: (state, action: PayloadAction<StepRequest>) => {
            return action.payload;
        },

        setRecipeId: (state, action: PayloadAction<number>) => {
            state.recipeId = action.payload;
        },

        setStepNumber: (state, action: PayloadAction<number>) => {
            state.stepNumber = action.payload;
        },

        resetStep: state => {
            var nextStep = initialState;
            nextStep.stepNumber = state.stepNumber;
            return nextStep;
        }
    }
});

export const { setCurrentStep, setStepNumber, setRecipeId, resetStep } = stepSlice.actions;
export const currentStep = (state: RootState) => state.currentStep;
export default stepSlice.reducer;