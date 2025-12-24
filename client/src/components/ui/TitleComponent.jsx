import React from 'react'

const TitleComponent = ({ title, subTitle, align }) => {
  return (
    <div className={`flex flex-col justify-center items-center text-center ${align === "left" && "md:items-start md:text-left"}`}>
      <h1 className='font-semibold text-gray-900 text-4xl md:text-[40px]'>{title}</h1>
      <p className='text-gray-500/90 text-sm md:text-base mt-2 max-w-156'>{subTitle}</p>
    </div>
  )
}

export default TitleComponent
