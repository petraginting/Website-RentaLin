import React, { useCallback, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { TitleComponent } from '../components/ui'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/useAppContext'
import { dateLocale } from '../helper/dateLocale'
import { formatPriceIDR } from '../helper/amount'
import Swal from 'sweetalert2'

const BookingPage = () => {

  const { axios, user } = useAppContext()

  const [bookings, setBookings] = useState([])

  const fetchMyBookings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", { withCredentials: true })

      if (data.succes) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [axios])

  const handleDeleteBooking = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Apa kamu yakin?",
        text: "Membatalkan pemesanan ini.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, batalkan!",
        cancelButtonText: "Tidak",
        icon: "question"
      })

      if (!result.isConfirmed) return

      const { data } = await axios.post('/api/bookings/delete', { bookingId: id },
        { withCredentials: true }
      )

      if (data.succes) {
        Swal.fire({
          title: "Berhasil!",
          text: "Anda berhasil membatalkan pemesanan.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        })
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user, fetchMyBookings])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 text-sm mt-16 max-w-7xl'>
      <TitleComponent
        title='Pesanan Saya'
        subTitle='Melihat dan mengelola semua pemesanan kendaraan Anda'
        align='left' />

      <div>
        {bookings.map((item, idx) => (
          <div key={idx} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>

            {/* car image + info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={item.product.image} alt="..." className='w-full h-auto aspect-video object-cover' />
              </div>
              <p className='text-lg font-medium mt-2'>{item.product.brand} {item.product.model}</p>
              <p className='text-gray-500 text-xs lg:text-sm'>{item.product.year} • {item.product.category} • {item.product.location}</p>
            </div>

            {/* booking info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1 text-gray-800 bg-light rounded-md'>Pesanan #{idx + 1}</p>
                <p className={`px-3 py-1 text-xs rounded-md ${item.status === "Dikonfirmasi" ? "bg-green-400/15 text-green-600" : "bg-red-400/15 text-red-600"}`}>{item.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="..." className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Waktu Sewa</p>
                  <p className='text-gray-800'>{dateLocale(item.pickupDate)} - {dateLocale(item.returnDate)}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="..." className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Lokasi Penjemputan</p>
                  <p className='text-gray-800'>{item.product.location}</p>
                </div>
              </div>
            </div>

            {/* price */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>

              <div className='text-gray-500 text-right'>
                <p>Total Harga</p>
                <h1 className='text-2xl font-semibold text-primary'>{formatPriceIDR(item.price)}</h1>
                <p>Pemesanan pada {dateLocale(item.createdAt)}</p>
              </div>

            </div>

            <div className='flex gap-3 md:col-span-2'>
              <button onClick={() => handleDeleteBooking(item._id)} className='border border-borderColor text-gray-500 hover:bg-[#d33] p-3 rounded-xl cursor-pointer hover:text-white w-full'>Hapus</button>
              <button className='bg-tombol hover:bg-[#3085d6] p-3 rounded-xl cursor-pointer text-white w-full'>Lihat Detail</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default BookingPage
