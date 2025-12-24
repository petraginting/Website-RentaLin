import React from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'

const FooterComponent = () => {

    const location = useLocation()

    return (
        <>

            {
                location.pathname === "/login" ? ("") : (

                    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-30 text-gray-500 bg-light">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-8 py-10 border-b border-gray-500/30">

                            <div className="max-w-96">
                                <img src={assets.logo} alt="logo" className='h-17 md:h-18 md:w-22' />
                                <p className="mt-6 text-sm text-gray-500">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.
                                </p>
                                <div className="flex items-center gap-2 md:gap-3 mt-3">
                                    <a href="#">
                                        <img src={assets.facebook_logo} alt="facebook" className='w-5 md:w-6 h-6' />
                                    </a>
                                    <a href="#">
                                        <img src={assets.instagram_logo} alt="instagram" className='w-5 md:w-6 h-6' />
                                    </a>
                                    <a href="#">
                                        <img src={assets.twitter_logo} alt="twitter" className='w-5 md:w-6 h-6' />
                                    </a>
                                </div>
                            </div>

                            <div className="w-1/2 lg:w-1/3 flex flex-wrap md:flex-nowrap justify-between">
                                <div>
                                    <h2 className="font-semibold text-gray-800 mb-5 text-lg">LINK MENU</h2>
                                    <div className="text-sm text-gray-500 space-y-2 list-none">
                                        <li><Link to="/">Beranda</Link></li>
                                        <li><Link to="/my-products">Porduk</Link></li>
                                        <li><Link to="/my-bookings">Pesanan</Link></li>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-800 mb-5 text-lg">HUBUNGI KAMI</h2>
                                    <ul className="text-sm text-gray-500 space-y-2 list-none">
                                        <li><a>123 RentaLin</a></li>
                                        <li><a>Jl.Pancasila</a></li>
                                        <li><a>+62 88131150447</a></li>
                                        <li><a>rentallin@gmail.com</a></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                        <p className="py-5 pb-10 text-center text-xs md:text-sm text-gray-500">
                            Copyright 2025 © <a href="https://prebuiltui.com">RentaLin</a>. All Right Reserved.
                        </p>
                    </footer>
                )
            }
        </>
    )
}

export default FooterComponent
