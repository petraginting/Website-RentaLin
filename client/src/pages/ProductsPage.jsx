import React, { useCallback, useEffect, useState } from 'react'

import { assets } from '../assets/assets'
import { Card, TitleComponent } from '../components/ui'
import { useLocation, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/useAppContext'

const ProductPage = () => {

  const { products, axios } = useAppContext()
  const location = useLocation()

  // Ambil parameter search dari url
  const [searchParams] = useSearchParams()
  const pickupDate = searchParams.get("pickupDate")
  const returnDate = searchParams.get("returnDate")
  const type = searchParams.get("type")

  const [input, setInput] = useState('')
  const [isLoading, setIsloading] = useState(true)

  const isSearchData = type && pickupDate && returnDate
  const [filterProducts, setFilterProducts] = useState([])

  const applyFilter = useCallback(() => {
    try {
      if (input === '') {
        setFilterProducts(products)
        return null
      }

      const searchFeature = products.slice().filter((item) => {
        return item.brand.toLowerCase().includes(input.toLowerCase()) || item.model.toLowerCase().includes(input.toLowerCase()) || item.transmission.toLowerCase().includes(input.toLowerCase()) || item.category.toLowerCase().includes(input.toLowerCase()) || item.fuel_type.toLowerCase().includes(input.toLowerCase())
      })
      setFilterProducts(searchFeature)
    } catch (error) {
      console.log(error);

    } finally {
      setIsloading(false)
    }

  }, [input, products])

  const searchProductsAvailability = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        type: type,
        returnDate,
        pickupDate
      },
        {
          withCredentials: true
        }
      )

      if (data.succes) {
        setFilterProducts(data.availableProducts)
        console.log(data.availableProducts.length);
        setIsloading(false)

        if (data.availableProducts.length === 0) {
          toast("Kendaraan tersedia tidak ada")
        }
        return null
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false)
    }
  }, [axios, pickupDate, type, returnDate])

  useEffect(() => {
    isSearchData && searchProductsAvailability()
  }, [isSearchData, searchProductsAvailability])

  useEffect(() => {
    products.length > 0 && !isSearchData && location.pathname && applyFilter()
  }, [input, products, location, isSearchData, applyFilter])

  window.scrollTo(0, 0)


  return (
    <div>
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <TitleComponent title="Kendaraan Tersedia" subTitle="Jelajahi pilihan kendaraan premium kami yang tersedia untuk petualangan Anda berikutnya" />

        <div className='flex items-center px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow bg-white'>
          <img src={assets.search_icon} alt="..." className='w-4.5 h-4.5 mr-2' />

          <input
            value={input}
            type="text"
            placeholder='Cari berdasarkan merek, model, atau fitur'
            onChange={(e) => setInput(e.target.value)}
            className='h-full w-full outline-none text-gray-500' />

          <img src={assets.filter_icon} alt="..." className='w-4.5 h-4.5 ml-2' />
        </div>
      </div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10 '>
        {isLoading
          ?
          <p className='text-gray-400 xl:px-20 max-w-7xl mx-auto tracking-wide py-4'>Sedang mencari kendaraan...</p>
          :
          <p className='text-gray-400 xl:px-20 max-w-7xl mx-auto tracking-wide py-4'>Menampilkan '{filterProducts.length}' Kendaraan</p>
        }

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto '>
          {filterProducts.map((item, idx) => (
            <Card key={idx} vehicle={item} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default ProductPage
