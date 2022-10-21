import React from 'react'
import BodyChatBox from './BodyChatBox';
import FooterChatBox from './FooterChatBox';
import HeaderChatBox from './HeaderChatBox';

function ChatBox() {
  
  return (
    <div className=' overflow-hidden flex flex-col bg-slate-50'>
      <HeaderChatBox />
      <BodyChatBox />
      <FooterChatBox />
    </div>
  )
}

export default ChatBox