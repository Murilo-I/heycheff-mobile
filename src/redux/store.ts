import { configureStore } from "@reduxjs/toolkit";

import navigationReducer from "./nav/navigationSlice";
import profileReducer from "./user/profileSlice";
import thirdPartyReducer from "./user/thirdPartySlice";
import redirectRecipe from "./recipe/redirect";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        navigation: navigationReducer,
        thirdParty: thirdPartyReducer,
        redirectRecipe: redirectRecipe
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;