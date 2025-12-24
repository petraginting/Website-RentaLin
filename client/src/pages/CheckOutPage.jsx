import React, { useCallback } from 'react'
import { useAppContext } from '../context/useAppContext'
import toast from 'react-hot-toast'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import NotFound404 from './NotFound404'
import { formatPriceIDR } from '../helper/amount'
import { assets } from '../assets/assets'
import Swal from 'sweetalert2'

const CheckOutPage = () => {
    const { axios, user, products, fetchUser, setUser } = useAppContext()

    const { id } = useParams()
    const [product, setProduct] = React.useState(null)
    const [dataCheck, setDataCheck] = React.useState(null)
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [address, setAddress] = React.useState("")
    const [loadingData, setLoadingData] = React.useState(true)
    const [dataNotFound, setDataNotFound] = React.useState(false)
    const [loadingSubmit, setLoadingSubmit] = React.useState(true)
    const navigate = useNavigate()

    const fetchChekoutData = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/bookings/checkout/get-data', { withCredentials: true })

            if (data.succes) {
                await fetchUser()
                setDataCheck(data.data)
                console.log("sok");

            } else {
                console.error(data.message || "Gagal memuat sesi checkout.");
                setDataNotFound(true);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Hapus user di client state jika 401 diterima
                setUser(null);
                setDataNotFound(true);
                toast.error("Sesi Anda telah berakhir, dialihkan.");
                return <Navigate to="/" replace />;
            }

            const errorMessage = error.response?.data?.message
            console.log(errorMessage);

        } finally {
            setLoadingData(false)
        }
    }, [axios, fetchUser, setUser])

    React.useEffect(() => {
        fetchChekoutData()
    }, [fetchChekoutData])

    React.useEffect(() => {
        if (!products || !dataCheck || products.length === 0) return;

        try {
            const foundProduct = products.find(p => p._id === dataCheck.productId);

            if (foundProduct && user && dataCheck.productId === id) {
                setProduct(foundProduct)
                setDataNotFound(false);
                console.log(foundProduct);

                console.log("aokoa");
                console.log(id);
                console.log(dataCheck.productId);
            } else {
                setDataNotFound(true);
                console.log("Product not found or user not logged in.");
            }
        } catch (error) {
            console.log(error.message);
            setDataNotFound(true);
        }

    }, [id, products, navigate, dataCheck, user])

    console.log(dataCheck);
    console.log(product);

    const deleteCheckoutSession = async () => {
        try {
            const { data } = await axios.post('/api/bookings/delete-session', {},
                { withCredentials: true }
            )

            if (data.succes) {
                console.log(data.message);
            } else {
                console.error(data.message || "Gagal menghapus sesi checkout.");
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            toast.error("Silahkan login terlebih dahulu")
            navigate("/login")
            return
        }

        const toDateOnly = (d) => {
            const date = new Date(d);

            if (!date) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        if (toDateOnly(dataCheck.pickupDate) === toDateOnly(dataCheck.returnDate)) return toast.error("Minimal peminjaman 1 hari")

        try {
            const result = await Swal.fire({
                title: "Apa kamu yakin?",
                text: "Membuat pemesanan ini.",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, buat!",
                cancelButtonText: "Tidak",
                icon: "question"
            })

            setLoadingSubmit(false)

            if (!result.isConfirmed) return

            const { data } = await axios.post("/api/bookings/create", {
                product: dataCheck.productId,
                pickupDate: toDateOnly(dataCheck.pickupDate),
                returnDate: toDateOnly(dataCheck.returnDate),
                phoneNumber: phoneNumber,
                address: address
            }, { withCredentials: true })

            if (data.succes) {
                await deleteCheckoutSession()
                Swal.fire({
                    title: "Berhasil!",
                    text: data.message || "Pemesanan berhasil dibuat.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate("/my-bookings", { replace: true })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingSubmit(true)
        }
    }


    if (loadingData) {
        return <h1>Loading...</h1>
    }

    if (dataNotFound) return <NotFound404 />

    if (dataCheck.productId !== id) return <NotFound404 />

    if (!product) {
        return <h1>Loading...</h1>
    }

    const noOfDay = Math.max(
        1,
        Math.ceil((new Date(dataCheck.returnDate) - new Date(dataCheck.pickupDate)) / (1000 * 60 * 60 * 24))
    )

    const totalPrice = product.pricePerDay * noOfDay
    const formatPrice = formatPriceIDR(totalPrice)

    return (
        <div className='mt-6 px-6 md:px-16 lg:px-32'>
            <form onSubmit={handleSubmit} className='border rounded-md border-borderColor m-auto xl:max-w-[50%] p-6 flex flex-col justify-center space-y-6 text-gray-500'>

                <div>
                    <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Detail Pemesanan</h2>
                    <p className='text-gray-400'>Pastikan data pemesanan sudah benar</p>
                </div>

                <div>
                    <div className='flex justify-between'>
                        <img src={product.image} alt="" className='w-40 rounded-md h-25 object-cover' />
                        <h1>{formatPriceIDR(product.pricePerDay)} <span className='text-sm'>/hari</span></h1>
                    </div>
                    <div>
                        <p className='mt-2 text-gray-800 font-medium'>{product.brand} {product.model} {product.year}</p>
                        <p className='text-sm'>{product.category} • {product.year}</p>
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600 max-w-70'>
                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.users_icon} alt="" className='mr-2 h-2' />
                            <span>{product.seating_capacity} Seats</span>
                        </div>

                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.fuel_icon} alt="" className='mr-2 h-2' />
                            <span>{product.fuel_type}</span>
                        </div>

                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.car_icon} alt="" className='mr-2 h-2' />
                            <span>{product.transmission}</span>
                        </div>

                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.location_icon} alt="" className='mr-2 h-2.5' />
                            <span>{product.location}</span>
                        </div>
                    </div>

                    <div className='my-4'>
                        <p className='ml-auto w-fit text-gray-700 font-medium'>Total Harga: {formatPrice}</p>
                    </div>
                </div>

                <div className='flex gap-6 lg:gap-3 flex-col lg:flex-row'>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="pickup-date">Tanggal Pengambilan</label>
                        <DatePicker
                            selected={dataCheck.pickupDate}
                            readOnly
                            dateFormat="yyyy-MM-dd"
                            className=' bg-gray-200 px-3 py-2 rounded-lg w-full outline-none'
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="pickup-date">Tanggal Pengambilan</label>
                        <DatePicker
                            selected={dataCheck.returnDate}
                            readOnly
                            dateFormat="yyyy-MM-dd"
                            className='bg-gray-200 px-3 py-2 rounded-lg w-full outline-none'
                            required
                        />
                    </div>
                </div>

                {/* nomor hp, alamat */}
                <div className='space-y-6'>
                    <div>
                        <p className='text-gray-500'>Nomor ponsel</p>
                        <input onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} type="text" placeholder='Massukan nomor ponsel' className='border border-borderColor px-3 py-2 rounded-lg w-full outline-none' required />
                    </div>
                    <div>
                        <p className='text-gray-500'>Alamat</p>
                        <textarea onChange={(e) => setAddress(e.target.value)} value={address} rows={3} placeholder='Massukan alamat' className='border border-borderColor px-3 py-2 rounded-lg w-full outline-none' required />
                    </div>
                </div>

                <button className='bg-tombol hover:bg-primary p-3 rounded-xl cursor-pointer text-white'>{!loadingSubmit ? "Sedang diproses...." : "Konfirmasi Pemesanan"}</button>
            </form>
        </div>
    )
}

export default CheckOutPage

