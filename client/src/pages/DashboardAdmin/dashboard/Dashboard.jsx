import React, { useCallback, useEffect, useState } from 'react'
import { assets } from '../../../assets/assets'
import { Title } from '../../../components/owner'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../context/useAppContext'
import { formatPriceIDR } from '../../../helper/amount'


const Dashboard = () => {

  const { axios, isOwner } = useAppContext()

  const [data, setData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  })

  const dashboardCards = [
    { title: "Total Produk", value: data.totalProducts, icon: assets.carIconColored, color: "bg-blue-100", gradiant: "from-[#8ec0fc] to-[#1160ff]" },
    { title: "Total Booking", value: data.totalBookings, icon: assets.listIconColored, color: "bg-blue-100", gradiant: "from-[#8ec0fc] to-[#1160ff]" },
    { title: "Tertunda", value: data.pendingBookings, icon: assets.cautionIconColored, color: "bg-yellow-50", gradiant: "from-[#ffd979] to-[#fcb90f]" },
    { title: "Dikonfirmasi", value: data.confirmBookings, icon: assets.confirmBookingColored, color: "bg-green-100", gradiant: "from-[#71ff8e] to-[#05e827]" },
  ]

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard")
      if (data.succes) {
        setData(data.dashboardData)

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [axios])

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData()
    }
  }, [isOwner, fetchDashboardData])

  return (
    <div className='px-4 py-10 md:px-10 flex-1 bg-light'>
      <Title
        title="Dashboard RentaLin"
        style='p-1 bg-white rounded-md h-7'
        image={assets.dashboardIconColored}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 my-6 max-w-8xl">
        {dashboardCards.map((card, idx) => (
          <div key={idx} className={`flex gap-2 items-end justify-between p-4 rounded-md  bg-gradient-to-br ${card.gradiant} `}>
            <div className='flex flex-col gap-10'>
              <h1 className='text-lg font-semibold text-white'>{card.title}</h1>
              <p className={`text-2xl font-semibold text-white`}>{card.value}</p>
            </div>

            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${card.color}`}>
              <img src={card.icon} alt="" className='h-5 w-5' />
            </div>
          </div>
        ))}
      </div>

      <div className='flex gap-6 xl:gap-8'>

        {/* Pemesanan terbaru */}
        <div className='bg-white shadow-2xl/4 p-4 md:p-6 rounded-md max-w-2xl w-full'>
          <h1 className='text-xl font-medium text-gray-800'>Pemesanan Terbaru</h1>
          <p className='text-sm text-gray-500'>pemesanan pelanggan terbaru</p>

          {data.recentBookings.map((booking, idx) => (
            <div key={idx} className='mt-4 flex item-center justify-between'>

              <div className='flex items-center gap-2'>
                <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-50'>
                  <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                </div>

                <div>
                  <p className='text-gray-900'>{booking.product.brand} {booking.product.model}</p>
                  <p className='text-xs text-gray-500'>{booking.createdAt.split("T")[0]}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <p className='text-sm text-gray-500'>{formatPriceIDR(booking.price)}</p>
                <p className={`bg-gray-500/10 text-gray-600 px-3 py-0.5 text-xs  rounded-full`}>{booking.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Penghasilan perbulan */}
        <div className='bg-white shadow-2xl/4 rounded-md p-4 w-full max-w-md h-full'>
          <h1 className='text-gray-700 text-xl font-medium'>Pendapatan <span className='font-semibold text-sm text-primary/85'>/Bulan</span></h1>
          <p className='text-gray-500 text-sm'>pendapatan anda bulan ini</p>

          <h1 className='mt-6 text-2xl text-primary/95 font-semibold ms-auto w-max pr-2'> {formatPriceIDR(data.monthlyRevenue)}</h1>
        </div>
      </div>

      <div className='mt-12'>
        <Title
          title="Pengguna RentaLin"
          image={assets.usersIconColored}
          style="p-1 bg-white rounded-md h-8"
        />
      </div>

      <div className={`mt-6 flex gap-2 items-end justify-between p-4 rounded-md w-full max-w-md bg-white shadow-2xl/7`}>
        <div className='flex flex-col gap-10'>
          <h1 className='text-lg font-semibold text-gray-800'>Total Pengguna</h1>
          <p className={`text-2xl font-semibold text-primary`}>{data.totalUsers}</p>
        </div>

        <div className={`flex items-center justify-center h-10 w-10 rounded-full bg-blue-100`}>
          <img src={assets.usersIconColored} alt="" className='h-5 w-5' />
        </div>
      </div>

    </div>
  )
}

export default Dashboard
