import React from 'react'
import { assets } from '../../assets/assets';

const BannerComponent = () => {
    return (
        <div className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden bg-gradient-to-r from-[#0558FE] to-[#A9CFFF]'>

            <div className='text-white'>

                <h2 className='text-3xl font-medium'>Apakah Kamu Punya Kendaraan Mewah?</h2>
                <p className='mt-2'>Uangkan kendaraan anda dengan mudah dengan mendaftarkannya di RentaLin.</p>
                <p className='max-w-130'>Kami mengurus asuransi, verifikasi drive, dan pembayaran aman -- sehingga anda bisa mendapatkan penghasilan pasif, bebas stres.</p>

                <button className='mt-4 py-2.5 px-6 bg-white text-primary rounded-lg hover:bg-slate-100 transition-all text-sm md:mb-11 font-medium cursor-pointer'>Daftarkan sekarang</button>
            </div>

            <img src={assets.banner_car_image} alt="car" className='max-h-45 mt-10' />

        </div>
    )
}

export default BannerComponent;
