import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    selectedConversation: null,
    messages: [],
    loading: false,
    conversations: [],
}

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setConversations: (state, action) => {
            state.loading = action.payload.loading;
            state.conversations = action.payload.conversations;
        },
    },
});

export const {setSelectedConversation, setMessages, setConversations} = conversationSlice.actions;
export default conversationSlice.reducer