import React, { useContext } from 'react'
import { FaUser } from "react-icons/fa";
import { IoCall,IoVideocam } from "react-icons/io5";
import {FiMoreHorizontal} from "react-icons/fi";
import { ChatContext } from '../../context/ChatContext';

function HeaderChatBox() {

  const {data} = useContext(ChatContext)

  return (
    <div className=' py-3 px-4 flex border-b items-center justify-between'>
        <div className='flex gap-x-4 '>
          <div className=' border-gray-700 rounded-full border h-9 w-9 relative before:absolute before:top-[30%] before:left-0 before:h-2 before:w-2 before:translate-y-[-100%] before:z-30 before:rounded-full before:bg-green-400'>
              <img src={data.user.photoURL} className=" h-full w-full object-cover rounded-full " alt="" />
          </div>
          <div>
            <h3 className=' font-semibold'>{data.user.displayName}</h3>
            <p className=' text-xs'>En ligne</p>
          </div>
        </div>
        <div className='flex gap-x-4'>
          <IoCall className=' cursor-pointer text-xl'/>
          <IoVideocam className=' cursor-pointer text-xl'/>
          <FiMoreHorizontal className=' cursor-pointer text-xl' />
        </div>
    </div>
  )
}

export default HeaderChatBox