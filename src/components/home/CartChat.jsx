import React, { useContext, useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

function CartChat({item}) {

    const {dispatch,data} = useContext(ChatContext)


    // Change chat
    const hundleSelect = (u) =>{
        dispatch({type:"CHANGE USER",payload:u})
    }

    useEffect(()=>{
        console.log(data.user.uid); 
    },[data.user])
  return (
    <div className={`${item.userInfo.uid == data.user.uid ? "border-l-4 border-green-400  bg-slate-800 text-white mt-3" : "bg-slate-100  hover:bg-white mt-3"} shadow-lg p-6 cursor-pointer duration-200 `} onClick={() => hundleSelect(item.userInfo)}>
        <div className='flex justify-between'>
            <div className='flex gap-x-4'>
                <div>
                    <div className='h-12 w-12 rounded-full border-gray-700 border relative before:absolute before:top-[30%] before:left-0 before:h-2 before:w-2 before:translate-y-[-100%] before:z-30 before:rounded-full before:bg-green-400'>
                        <img src={item.userInfo.photoURL} className="h-full w-full rounded-full object-cover" alt="" />
                    </div>
                </div>
                <div>
                    <h3 className=' font-semibold '>{item.userInfo.displayName}</h3>
                    <span className=' text-xs'>En ligne</span>
                </div>
            </div>
            <p className=' text-xs'>3h</p>
        </div>
        <p className=' text-sm mt-3'>{item.lastmessage?.text}</p>
    </div>
  )
}

export default CartChat