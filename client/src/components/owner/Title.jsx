import React from 'react'

const Title = ({ title, image, style }) => {
  return (
    <div className='flex items-center gap-3'>
      <img src={image} alt="" className={style} />
      <h1 className='font-medium text-xl text-gray-800'>{title}</h1>
      {/* <p className='text-sm text-gray-600 mt-2 max-w-156'>{subTitle}</p> */}
    </div>
  )
}

export default Title
