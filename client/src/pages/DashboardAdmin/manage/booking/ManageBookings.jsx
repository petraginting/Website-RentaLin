import React, { useCallback, useEffect, useState } from 'react'
import { Title } from '../../../../components/owner'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useAppContext } from '../../../../context/useAppContext'
import { assets } from '../../../../assets/assets'
import TableBookings from './TableBookings'
import { header_booking_manage } from '../../../../utils/datas'

const ManageBookings = () => {

    const { isOwner, axios } = useAppContext()

    const [bookings, setBookings] = useState([])

    const fetchOwnerBookings = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/bookings/owner")

            data.succes ? setBookings(data.bookings) : console.error(data.message)
        } catch (error) {
            console.log(error.message);
        }
    }, [axios])

    useEffect(() => {
        isOwner && fetchOwnerBookings()
    }, [isOwner, fetchOwnerBookings])

    const changeStatusBooking = async (bookingId, status) => {
        try {
            const result = await Swal.fire({
                title: "Apa kamu yakin?",
                text: "Mengubah status pemesanan pelanggan.",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, ubah!",
                icon: "question"
            })

            if (!result.isConfirmed) return

            const { data } = await axios.post("/api/bookings/change-status", { bookingId, status })

            if (data.succes) {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Anda berhasil mengubah status pemesanan.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
                fetchOwnerBookings()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>

            <Title
                title="Mengelola Pemesanan RentaLin"
                image={assets.listIconColored}
                style='p-1 bg-white rounded-md h-7.5'
            />

            <TableBookings
                header={header_booking_manage}
                datas={bookings}
                changeStatusBooking={changeStatusBooking}
            />

        </div>
    )
}

export default ManageBookings
