import React, { useEffect, useRef } from 'react'

function MessageSend({data}) {

  const ref = useRef()
  
  useEffect(()=>{
    ref.current?.scrollIntoView({ behavior:"smooth" })
  },[data])

  return (
    <div className='flex flex-col items-end px-4  ' ref={ref}>
      {data.img && <img src={data.img} className='w-1/3 h-[200px] mb-3 object-cover' alt="" /> }
      <p className='p-3 bg-teal-800 rounded-b-2xl rounded-tl-2xl max-w-[80%] text-white w-fit'>{data.text}</p>
      <span className=' text-[10px] mt-2'>{}</span>
    </div>
  )
}

export default MessageSend