import React, { useState } from 'react'
import { Title } from '../../../components/owner'
import { assets } from '../../../assets/assets'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../context/useAppContext'
import { vehicleFeaturesOption } from '../../../utils/datas'

const AddProduct = () => {

  const { axios } = useAppContext()
  const types = ["Mobil", "Motor"]

  const [image, setImage] = useState(null)
  const [seatingCapasity, setseatingCapasity] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [features, setFeatures] = useState([])
  const [product, setProduct] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    machine_capacity: '',
    fuel_type: '',
    location: '',
    description: '',
    category: '',
    type: '',
    transmission: '',
  })

  const isValidYear = (year) => {
    const y = Number(year)
    const current = new Date().getFullYear()

    return /^\d{4}$/.test(year) && y >= 1980 && y <= current
  }

  const addFeature = (value) => {
    if (!value) return;
    if (!features.includes(value)) {
      setFeatures([...features, value])
    }
  }

  const removeFeature = (value) => {
    setFeatures((prev) => prev.filter((item) => item !== value))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return null

    if (!product.brand || !product.model || !product.type) {
      toast.error("Harap lengkapi semua data wajib");
      setIsLoading(false);
      return;
    }

    if (!isValidYear(product.year)) return toast.error("Tahun tidak valid");

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append("productData", JSON.stringify(product))

      if (product.type === "Mobil") {
        formData.append('seating_capacity', seatingCapasity)
        formData.append('features', JSON.stringify(features))
      }

      const { data } = await axios.post("/api/owner/add-product", formData)

      if (data.succes) {
        toast.success(data.message)
        setImage(null)
        setseatingCapasity(0)
        setProduct({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          machine_capacity: '',
          fuel_type: '',
          location: '',
          description: '',
          category: '',
          type: '',
          transmission: '',
        })
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 md:px-10 pt-10'>
      <Title
        title="Tambah Kendaraan RentaLin"
        image={assets.addIconColored}
        style="p-2 bg-white rounded-md h-8"
      />

      <form onSubmit={onSubmitHandler} className='grid grid-cols-12 gap-5 mt-6 mb-10 text-sm '>

        <div className='bg-white p-10 rounded-md shadow-2xl/4 flex flex-col gap-5 col-span-7'>
          {/* Produk image */}
          <div className='flex items-center gap-5 w-full'>
            <label htmlFor="procuct-image" >
              <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-18 cursor-pointer rounded-lg' />
              <input type="file" id='procuct-image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />
            </label>
            <p className='text-gray-400 text-sm'>Upload foto produk anda</p>
          </div>

          {/* Tipe kenndaraan (mobil / motor)*/}
          <div className='flex items-center gap-6 ms-auto w-max  text-gray-500' >
            {types.map((item) => (
              <label key={item} className='flex items-center justify-center gap-2'>
                <input
                  type="radio"
                  value={item}
                  name='type'
                  onChange={(e) => setProduct({ ...product, type: e.target.value })}
                  checked={product.type === item}
                  required />
                {item}
              </label>
            ))}
          </div>

          {/* Brand, model, dan kategori mobil */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Brand</label>
              <input type="text" placeholder='cth. BMW, Marcedes, Toyota...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={product.brand} onChange={e => setProduct({ ...product, brand: e.target.value })} />
            </div>

            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Model</label>
              <input type="text" placeholder='cth. Wrangler, , Corolla...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={product.model} onChange={e => setProduct({ ...product, model: e.target.value })} />
            </div>

            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Kategori</label>
              <input type="text" placeholder='cth. Pick Up, Sport, Sedan...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })} />
            </div>
          </div>

          {/* Tahun, harga, dan kategori mobil */}
          <div className='grid grid-cols-1, md:grid-cols-2 lg:grid-cols-3 gap-6'>

            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Tahun</label>
              <input type="number" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={product.year} onChange={e => setProduct({ ...product, year: e.target.value })} />
            </div>

            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Harga harian(IDR)</label>
              <input type="number" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={product.pricePerDay} onChange={e => setProduct({ ...product, pricePerDay: e.target.value })} />
            </div>

            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Kapasitas Mesin</label>
              <input type="text" placeholder='cth. 1500 cc' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={product.machine_capacity} onChange={e => setProduct({ ...product, machine_capacity: e.target.value })} />
            </div>
          </div>

          {/* Transmisi, tipe bahan bakar, dan kapasitas kursi mobil */}
          <div className='grid grid-cols-1, md:grid-cols-2 lg:grid-cols-3 gap-6'>

            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Transmisi</label>
              <select value={product.transmission} onChange={e => setProduct({ ...product, transmission: e.target.value })} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'>
                <option value="">Pilih transmisi mobil</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
              </select>
            </div>

            <div className='flex flex-col w-full'>
              <label className='text-gray-500'>Tipe bahan bakar</label>
              <select value={product.fuel_type} onChange={e => setProduct({ ...product, fuel_type: e.target.value })} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'>
                <option value="">Pilih bahan bakar mobil</option>
                <option value="Solar">Solar</option>
                <option value="Bensin">Bensin</option>
                <option value="Gas">Gas</option>
              </select>
            </div>

            {product.type === "Mobil" ? (<div className='flex flex-col w-full'>
              <label className='text-gray-500'>Jumlah Kursi</label>
              <input type="number" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={seatingCapasity} onChange={e => setseatingCapasity(e.target.value)} />
            </div>) : ""}


          </div>

          {/* lokasi rental */}
          <div className='flex flex-col w-full'>
            <label className='text-gray-500'>Lokasi</label>
            <select value={product.location} onChange={e => setProduct({ ...product, location: e.target.value })} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'>
              <option value="">Pilih lokasi</option>
              <option value="Purwokerto">Purwokerto</option>
            </select>
          </div>

          {/* Deskripsi Mobil */}
          <div className='flex flex-col w-full'>
            <label className='text-gray-500'>Deskripsi</label>
            <textarea rows={5} placeholder='cth. SUV mewah dengan interior yang luas dan mesin yang bertenaga' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400' value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })}></textarea>
          </div>

          {product.type === "Motor" && <button className='bg-tombol hover:bg-primary w-full py-3 rounded-xl cursor-pointer text-white'>{isLoading ? "Sedang dikirim..." : 'Tambah Kendaraan'}</button>}

        </div>

        {product.type === "Mobil" && <div className='col-span-5 flex flex-col gap-8 bg-white p-10 rounded-md shadow-2xl/4 h-max sticky top-10'>
          {/* Selected Features */}
          {features.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-1'>
              {features.map((item, idx) => (
                <span
                  key={idx}
                  onClick={() => removeFeature(item)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-300 transition">
                  {item}
                  <span className="text-gray-500 text-sm">✕</span>
                </span>
              ))}
            </div>
          )}

          <hr className={`${features.length === 0 ? "mt-16" : ""} text-gray-300`} />

          {/* Fitur */}
          <select
            onChange={(e) => {
              addFeature(e.target.value);
              e.target.value = ""; // reset select setelah dipilih
            }}
            className="mt- px-3 py-2 border border-borderColor rounded-md outline-none text-gray-500"
          >
            <option value="">Tambah fitur...</option>
            {vehicleFeaturesOption.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button className='bg-tombol hover:bg-primary w-full py-3 rounded-xl cursor-pointer text-white'>{isLoading ? "Sedang dikirim..." : 'Tambah Kendaraan'}</button>

        </div>}



      </form>
    </div>
  )
}

export default AddProduct
