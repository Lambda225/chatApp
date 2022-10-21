import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { db } from '../../firebase'
import MessageReceived from './MessageReceived'
import MessageSend from './MessageSend'

function BodyChatBox() {

  const [messages,setMessages] = useState([])
  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  useEffect(() =>{

    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().message);
    });

    return () =>{
      unsub()
    }

  },[data.chatId])

  return (
    <div className='h-full mt-3 chat overflow-y-scroll'>
      {
        messages.map((message) =>{
          return message.senderId == currentUser.uid
          ? <MessageSend key={message.id} data={message} />
          :<MessageReceived key={message.id} data={message} />
        })
      }
    </div>
  )
}

export default BodyChatBox