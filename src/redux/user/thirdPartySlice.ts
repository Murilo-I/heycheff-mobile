import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

const initialState: { profileId: string | undefined } = {
    profileId: undefined
}

export const thirdPartySlice = createSlice({
    name: 'thirdParty',
    initialState,
    reducers: {
        set3PartyProfileId: (state, action: PayloadAction<string | undefined>) => {
            state.profileId = action.payload;
        },

        reset3PartyProfile: state => {
            state.profileId = undefined;
        }
    }
});

export const { set3PartyProfileId, reset3PartyProfile } = thirdPartySlice.actions;
export const thirdParty = (state: RootState) => state.thirdParty;
export default thirdPartySlice.reducer;