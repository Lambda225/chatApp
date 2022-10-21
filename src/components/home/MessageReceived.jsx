import React, { useEffect, useRef } from 'react'

function MessageReceived({data}) {

  const ref = useRef()
  
  useEffect(()=>{
    ref.current?.scrollIntoView({ behavior:"smooth" })
  },[data])

  return (
    <div className='flex flex-col px-4 ' ref={ref}>
      <div className=''>
        {data.img &&  <img src={data.img} className='w-1/3 h-[200px] mb-3 object-cover' alt="" /> }
        <p className='p-3 bg-slate-200 rounded-b-2xl rounded-tr-2xl max-w-[80%] w-fit'>{data.text}</p>
        <span className=' text-[10px] mt-2'>06-22 10-26 AM</span>
      </div>
    </div>
  )
}

export default MessageReceived