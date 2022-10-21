import React from 'react'
import ChatBox from './ChatBox'
import ContactBox from './ContactBox'
import WrapperHome from './WrapperHome'

function Home() {
  return (
    <div className=' h-screen flex justify-center items-center'>
        <WrapperHome>
            <ContactBox />
            <ChatBox />
        </WrapperHome>
    </div>
  )
}

export default Home