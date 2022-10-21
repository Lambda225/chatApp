import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { auth } from '../firebase'
import { AuthContext } from './AuthContext'

export const ChatContext = createContext()
function ChatProvider({children}) {

    const {currentUser} = useContext(AuthContext) 

    const intialiseValue = {
        user:'',
        chatId:'null'
    }

    const chatReducer = (state,action) =>{
        switch( action.type ){
            case "CHANGE USER":
                return {
                    user:action.payload,
                    chatId: currentUser.uid > action.payload.uid 
                    ?currentUser.uid + action.payload.uid
                    : action.payload.uid + currentUser.uid
                }
            default:
                return state
        }
    }

    const [state,dispatch] = useReducer(chatReducer,intialiseValue)
  return (
    <ChatContext.Provider value={{data:state,dispatch}}>
        {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider