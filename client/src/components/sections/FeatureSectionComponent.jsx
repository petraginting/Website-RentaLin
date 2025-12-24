import React from 'react'
import { assets } from '../../assets/assets'
import TitleComponent from '../ui/TitleComponent'
import CardComponent from '../ui/CardComponent'
import { useAppContext } from '../../context/useAppContext'

const FeatureSectionComponent = () => {

  const { products, navigate } = useAppContext()

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>

      <div>
        <TitleComponent title='Kendaraan Unggulan' subTitle='Jelajahi pilihan kendaraan premium kami yang tersedia untuk petualangan Anda berikutnya.' />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {
          products.slice(0, 6).map((car) => (
            <CardComponent key={car._id} vehicle={car} />
          ))
        }
      </div>

      <button onClick={() => {
        navigate('/my-products')
      }}
        className='flex gap-2 cursor-pointer items-center justify-center px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 '>
        Jelajahi semua kendaraan <img src={assets.arrow_icon} alt="arrow icon" />
      </button>

    </div>
  )
}

export default FeatureSectionComponent
