import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

const initialState = {
    index: 0
}

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setNavIndex: (state, action: PayloadAction<number>) => {
            state.index = action.payload;
        }
    }
});

const NEWS = 0;
const FEED = 1;
const RECEIPT_FORM = 2;
const SEARCH = 3;
const PERFIL = 4;

export const tabs = { NEWS, FEED, RECEIPT_FORM, SEARCH, PERFIL }
export const { setNavIndex } = navigationSlice.actions;
export const navigation = (state: RootState) => state.navigation;
export default navigationSlice.reducer;