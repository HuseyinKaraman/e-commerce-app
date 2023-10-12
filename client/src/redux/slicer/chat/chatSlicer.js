import { createSlice } from "@reduxjs/toolkit";

export const adminChatSlicer = createSlice({
    name: "adminChat",
    initialState: {
        chatRooms: {},
        socket: false,
        isNewMessage: false,
    },
    reducers: {
        setChatRooms: (state, action) => {
            let currentstate =  { ...state };
            if (state.chatRooms[action.payload.user]) {
                currentstate.chatRooms[action.payload.user].push({
                    client: action.payload.message,
                });
                state.chatRooms = { ...currentstate.chatRooms };
            } else {
                state.chatRooms = {
                    ...currentstate.chatRooms,
                    [action.payload.user]: [{ client: action.payload.message }],
                };
            }
        },
        // adminSendMessage: (state, action) => {
        //     let currentstate3 = state;
        //     if (state.chatRooms[action.payload.user]) {
        //         currentstate3.chatRooms[action.payload.user].push({
        //             admin: action.payload.message,
        //         });
        //         state.chatRooms = { ...currentstate3.chatRooms };
        //     }
        // },
        removeChatRoom: (state, action) => {
            let currentState2 = { ...state };
            delete currentState2.chatRooms[action.payload];
            state.chatRooms = { ...currentState2.chatRooms };
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setMessageRecieved: (state, action) => {
            state.isNewMessage = action.payload;
        },
    },
});

export const { setChatRooms, setSocket, setMessageRecieved, removeChatRoom } =
    adminChatSlicer.actions;
export default adminChatSlicer.reducer;
