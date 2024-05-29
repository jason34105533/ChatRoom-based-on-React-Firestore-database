import { useState, createContext, useEffect, useContext, useReducer } from "react";
import {auth} from "../firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();


export const ChatContextProvider = ({children}) => {
    const {currentUser} = useContext(AuthContext); //origin

    // Use Reducer
    const INITIAL_STATE = {
        chatId:"null",
        user:{}
    }

    const chatReducer = (state,action) =>{
        switch(action.type){
            case "CHANGE_CHATROOM":
                return{
                    user:action.payload,
                    chatId:action.payload.chatRoomId,
                }
            case "LOGOUT":
                return{
                    user:{},
                    chatId:"null",
                }
            default:
                return state;
        }
    }

    const [state,dispatch] = useReducer(chatReducer,INITIAL_STATE);

    return(
        <ChatContext.Provider value={{data:state,dispatch}}>
            {children}
        </ChatContext.Provider>
    );
};