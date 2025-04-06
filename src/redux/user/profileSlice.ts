import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceiptFeed } from '@/server/receipt';
import { UserInfo } from "@/server/user";
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
            const contents = [...state.content, ...action.payload];
            const contentsMap = new Map();
            contents.forEach(item => contentsMap.set(item.id, item));
            state.content = Array.from(contentsMap.values());
        },

        increasePage: state => {
            state.contentPage += 1;
        },

        resetContent: state => {
            state.content = [];
            state.contentPage = 0;
        }
    }
});

export const { setInfo, addContent, increasePage, resetContent } = profileSlice.actions;
export const userProfile = (state: RootState) => state.profile;
export default profileSlice.reducer;