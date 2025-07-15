import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='flex items-center gap-3 mb-4 font-bold'>
      <p className='text-gray-300'>{text1} <span className='text-gray-400 font-medium'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
    </div>
  )
}

export default Title
