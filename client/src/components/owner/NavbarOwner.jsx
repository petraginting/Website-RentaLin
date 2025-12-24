import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/useAppContext'

const NavbarOwner = () => {

  const { user } = useAppContext()

  return (
    <div className='p-2'>
      <div className='flex items-center justify-between px-6 md:px-24 py-2 md:p-4 text-gray-500 shadow-2xl/3 relative transition-all bg-white rounded-md'>

        <Link to="/">
          <img src={assets.logo} alt="" className='scale-130 md:scale-155 h-8 w-11' />
        </Link>

        <p className=''>Welcome, {user?.name || "Owner"}</p>
      </div>
    </div>
  )
}

export default NavbarOwner
