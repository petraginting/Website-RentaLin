import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/useAppContext'

const SideBar = () => {

  const { user, axios, fetchUser } = useAppContext()
  const location = useLocation()
  const [image, setImage] = useState("")

  const updateImage = async () => {
    try {
      const formData = new FormData()
      formData.append('image', image)

      const { data } = await axios.post('/api/owner/update-image', formData)
      if (data.succes) {
        fetchUser()
        toast.success("Update image berhasil")
        console.log(data.message)
        setImage('')
      } else {
        console.error(data.message)
        toast.error("Update image gagal")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full shadow-2xl/3 bg-white  text-sm'>

      <div className='group relative'>
        <label htmlFor="image">
          <img src={image ? URL.createObjectURL(image) : user?.image || "https://unsplash.com/id/foto/seorang-pria-berdiri-di-depan-dinding-ungu-bYODySpLIhE"} alt="" className='h-9 md:h-20 w-9 md:w-20 mx-auto rounded-full' />
          <input type="file" id='image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />

          <div className='cursor-pointer absolute hidden top-0 right-0 bottom-0 left-0 bg-black/10 rounded-full group-hover:flex items-center justify-center'>

            <img src={assets.edit_icon} alt="" />

          </div>
        </label>

      </div>

      {image && (
        <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer' onClick={updateImage}>Save <img src={assets.check_icon} width={13} alt="" /> </button>
      )}

      <p className='mt-2 text-base max-md:hidden text-gray-900'>{user?.name || "Owner"}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, idx) => (
          <NavLink key={idx} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? "bg-primary/10 text-primary" : "text-gray-600"}`}>

            <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="" className='w-4.5' />
            <span className='max-md:hidden'>{link.name}</span>

            <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded-l right-0 absolute`}></div>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default SideBar
