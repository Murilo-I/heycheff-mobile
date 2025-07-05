import { configureStore } from "@reduxjs/toolkit";

import navigationReducer from "./nav/navigationSlice";
import profileReducer from "./user/profileSlice";
import thirdPartyReducer from "./user/thirdPartySlice";
import redirectRecipe from "./recipe/redirect";
import stepReducer from "./step/stepSlice";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        navigation: navigationReducer,
        thirdParty: thirdPartyReducer,
        redirectRecipe: redirectRecipe,
        currentStep: stepReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;