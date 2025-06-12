import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

const initialState: { recipeId: number } = {
    recipeId: 0
}

export const redirectRecipeSlice = createSlice({
    name: 'redirectRecipe',
    initialState,
    reducers: {
        setRecipeId: (state, action: PayloadAction<number>) => {
            state.recipeId = action.payload
        }
    }
});

export const { setRecipeId } = redirectRecipeSlice.actions;
export const redirectRecipe = (state: RootState) => state.redirectRecipe;
export default redirectRecipeSlice.reducer;