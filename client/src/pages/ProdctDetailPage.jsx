import React, { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from '../context/useAppContext'

const ProdctDetailPage = () => {

  const { products, axios, pickupDate, setPickupDate, returnDate, setReturnDate, navigate, user } = useAppContext()

  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [unavailableDates, setUnavailableDates] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error("Silahkan login terlebih dahulu")
      navigate("/login")
      return null
    }

    if (returnDate <= pickupDate) {
      return toast.error("Minimal satu hari pengembalian.")
    }

    const toLocaleString = unavailableDates.map(date => date.toISOString().split('T')[0])
    const pickupDateCheck = pickupDate.toISOString().split('T')[0]
    const returnDateCheck = returnDate.toISOString().split('T')[0]

    const isConflict = toLocaleString.some(dateStr => {
      return dateStr > pickupDateCheck && dateStr < returnDateCheck
    })

    if (isConflict) {
      return toast.error("Ada tanggal yang tidak tersedia dalam rentang sewa Anda.")
    }

    try {
      const { data } = await axios.post('api/bookings/checkout/set-data', {
        productId: id,
        pickupDate,
        returnDate
      },
        {
          withCredentials: true
        }
      )

      if (data.succes) {
        navigate(`/checkout/${product._id}`)
      } else {
        toast.error(data.message || "Permintaan checkout gagal diproses.");
      }
    } catch (error) {
      // Hapus user di client state jika 401 diterima
      toast.error("Sesi Anda telah berakhir, dialihkan.");
      console.log(error);
      window.location.replace("/")
    }
  }

  const formDates = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/bookings/unavailable-dates/${id}`)

      if (data.succes) {
        const dates = data.unavailableDates.map(dateStr => new Date(dateStr))
        setUnavailableDates(dates)
      } else {
        navigate("/my-products")
        // console.error(data.message)
      }
    } catch (error) {
      console.log(error.message);

    }
  }, [axios, id, navigate])

  useEffect(() => {
    if (!id) return;
    setProduct(products.find(product => product._id === id))
    formDates()
  }, [products, id, formDates])


  return product ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <div className='grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-3'>

        <div className='lg:col-span-2'>
          <img src={product.image} alt={product.brand} className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />

          <div className='space-y-6'>
            <div>
              <h1 className="text-3xl font-bold">{product.brand} {product.model}</h1>
              <p className="text-lg text-gray-500">{product.category} • {product.year} • {product.machine_capacity}</p>
            </div>
            <hr className='border-borderColor' />

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${product.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: product.fuel_type },
                { icon: assets.car_icon, text: product.transmission },
                { icon: assets.location_icon, text: product.location },
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-[var(--color-light)] p-4 rounded-lg'>
                  <img src={icon} alt="..." className='h-5 mb-2' />
                  <p className='text-sm text-gray-500'>{text}</p>
                </div>
              ))}
            </div>

            {/* Deskripsi Kendaraan */}
            <div>
              <h1 className='text-xl font-semibold mb-3 text-gray-900'>Deskripsi</h1>
              <p className='text-gray-500'>{product.description}</p>
            </div>

            {/* Fitur */}
            {product.type === "Mobil" &&
              <div>
                <h1 className='text-xl font-semibold mb-3 text-gray-900'>Fitur</h1>
                <ul className='grid grid-cols-2 gap-2'>
                  {product?.features.map((item, idx) => (
                    <li key={idx} className='flex items-center text-gray-500'>
                      <img src={assets.check_icon} alt="..." className='h-4 mr-2' /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            }


          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className='shadow-lg space-y-6 h-max top-18 sticky rounded-lg p-6 text-gray-500'>

          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>IDR{product.pricePerDay} <span className='text-base text-gray-400 font-normal'> per hari</span> </p>

          <hr className='border-borderColor my-6' />

          <div className='flex flex-col gap-2'>
            <label htmlFor="pickup-date">Tanggal Pengambilan</label>
            <DatePicker
              selected={pickupDate}
              onChange={setPickupDate} //e => setPickupDate(e.target.value)
              excludeDates={unavailableDates}
              minDate={new Date()} //new Date().toISOString().split('T')[0]
              dateFormat="yyyy-MM-dd"
              placeholderText='Pilih tanggal pengambilan'
              className='border border-borderColor px-3 py-2 rounded-lg w-full outline-none'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="return-date">Tanggal Pengembalian</label>
            <DatePicker
              selected={returnDate}
              onChange={setReturnDate} //e => setReturnDate(e.target.value)
              excludeDates={unavailableDates}
              minDate={new Date()} //new Date().toISOString().split('T')[0]
              dateFormat="yyyy-MM-dd"
              placeholderText='Pilih tanggal pengembalian'
              className='border border-borderColor px-3 py-2 rounded-lg w-full outline-none'
              required
            />
          </div>

          <button className='bg-tombol hover:bg-primary w-full py-3 rounded-xl cursor-pointer text-white'>Pesan Sekarang</button>

          <p className='text-center text-sm'>Tidak perlu kartu kredit untuk reservasi</p>
        </form>
      </div>
    </div>
  ) : <h1>Loading...</h1>
}

export default ProdctDetailPage
