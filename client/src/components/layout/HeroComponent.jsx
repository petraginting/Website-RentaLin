import React from 'react'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/useAppContext'
import DatePicker from 'react-datepicker'

const HeroComponent = () => {

    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()

    const [type, setType] = useState('')
    const [imageLoaded, setImageLoaded] = useState(false)

    const handleImageLoad = () => {
        setImageLoaded(true)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/my-products?type=${type}&pickupDate=${pickupDate}&returnDate=${returnDate}`)
    }

    return (
        <div className='flex justify-center overflow-hidden px-6 md:px-16 lg:px-24 xl:px-32 pb-20 bg-gradient-to-b from-white to-gray-100 relative'>
            <div className='flex flex-col justify-evenly relative max-w-[100rem] min-h-[45rem]'>
                <div className='flex justify-between items-center relative'>
                    <div className='flex flex-col gap-5 max-w-150'>
                        <h1 className='text-4xl md:text-5xl xl:text-6xl font-semibold text-gray-950 '>Rental mobil <span className='text-tombol'>&</span> motor RentaLin</h1>

                        <p className='text-gray-500 font-medium'>Kendaraan ternyaman, harga bersahabat untuk anda yang ingin berpetualangan.</p>

                        <div className='flex mt-5'>
                            <div className='border-r-3 border-gray-300 flex flex-col justify-between h-20 pe-10'>
                                <h1 className='text-tombol text-5xl font-medium'>100+</h1>
                                <p className='text-gray-500 ms-1'>Kendaraan</p>
                            </div>
                            <div className='flex flex-col justify-between ps-12 h-20'>
                                <h1 className='text-gray-800 text-5xl font-medium'>50K+</h1>
                                <p className='text-gray-500 ms-1'>Pelanggan</p>
                            </div>
                        </div>
                    </div>

                    <img
                        src={assets.hero_car_bike_responsive}
                        alt="car"
                        className='max-h-200 md:h-70 xl:h-120 translate-x-[-3rem] z-10 mix-blend-multiply'
                        onLoad={handleImageLoad}
                    />
                    
                    {imageLoaded && <div className='p-80 rounded-full absolute right-[3rem] bg-transparent bottom-[-1rem] shadow-2xl/20 animate-floatX'></div>}

                    <div className='px-110 py-50 absolute right-[-4rem] bg-gray-50 bottom-[rem] mix-blend-lighten'></div>
                </div>

                <form onSubmit={handleSearch} action="" className='flex flex-col md:flex-row items-start md:items-center justify-between p-3 ms-6 rounded-lg bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] md:rounded-xl w-full max-w-80 md:max-w-275 z-10 relative'>

                    <div className='flex flex-col md:flex-row items-start md:items-center gap-8 min-md:ml-3 pe-5'>

                        <div className='flex items-center justify-center gap-3 border border-borderColor py-4 px-6 rounded-lg'>
                            <img src={assets.vehicleIcon} alt="" className='h-6' />
                            <select required value={type} onChange={(e) => setType(e.target.value)} className='outline-none text-gray-700'>
                                <option value="">Pilih kategori Kendaraan</option>
                                <option value="Mobil">Mobil</option>
                                <option value="Motor">Motor</option>
                            </select>
                            {/* <p className='px-1 text-sm text-gray-500'>{type ? type : 'Pilih lokasi anda'}</p> */}
                        </div>

                        <div className='flex items-center justify-center py-4 px-6 gap-3  border border-borderColor text-gray-700 rounded-lg'>
                            <img src={assets.calender_month} alt="" />
                            <DatePicker
                                selected={pickupDate}
                                onChange={setPickupDate}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                placeholderText='Pilih tanggal pengambilan'
                                className='outline-none'
                                required />
                        </div>

                        <div className='flex items-center justify-center gap-3 py-4 px-6 border border-borderColor text-gray-700 rounded-lg'>
                            <img src={assets.calender_month} alt="" />
                            <DatePicker
                                selected={returnDate}
                                onChange={setReturnDate}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                placeholderText='Pilih tanggal pengembalian'
                                className='outline-none'
                                required />
                        </div>


                    </div>
                    <button className='bg-tombol hover:bg-primary flex items-center justify-center px-9 py-3 gap-2 me-2 max-sm:mt-4 text-white rounded-xl cursor-pointer'>
                        <img src={assets.search_icon} alt="search" className='brightness-300' />
                        Cari
                    </button>



                </form>

                <div>

                </div>
            </div>

        </div>
    )
}

export default HeroComponent
