import React from 'react'

function WrapperHome({children}) {
  return (
    <div className=' w-9/12 h-[80%] shadow-lg overflow-hidden rounded-md grid grid-cols-[35%,1fr]'>
        {children}
    </div>
  )
}

export default WrapperHome