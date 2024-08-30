import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import conversationSlice from "./conversationSlice";

const store = configureStore({
    reducer:{
        auth: authSlice,
        conversation: conversationSlice
    }
});

export default store