import { UserInfo } from "@/server/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceiptFeed } from '@/server/receipt';
import { RootState } from "../store";

export interface UserProfileState {
    info: UserInfo | undefined,
    content: ReceiptFeed[],
    contentPage: number
}

const initialState: UserProfileState = {
    info: undefined,
    content: [],
    contentPage: 0
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setInfo: (state, action: PayloadAction<UserInfo>) => {
            state.info = action.payload;
        },

        addContent: (state, action: PayloadAction<ReceiptFeed[]>) => {
            state.content = [...state.content, ...action.payload];
        },

        increasePage: state => {
            state.contentPage += 1;
        }
    }
});

export const { setInfo, addContent, increasePage } = profileSlice.actions;
export const userProfile = (state: RootState) => state.profile;
export default profileSlice.reducer;