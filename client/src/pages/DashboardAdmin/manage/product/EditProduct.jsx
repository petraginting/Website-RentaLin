import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../../context/useAppContext'
import { assets } from '../../../../assets/assets'
import { vehicleFeaturesOption } from '../../../../utils/datas'
import { Title } from '../../../../components/owner'

const EditProduct = () => {

    const { axios } = useAppContext()
    const { id } = useParams()
    const navigate = useNavigate()

    const types = ["Mobil", "Motor"]

    const [image, setImage] = useState(null)
    const [seatingCapacity, setSeatingCapacity] = useState(0)
    const [features, setFeatures] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [product, setProduct] = useState({
        brand: '',
        model: '',
        year: '',
        pricePerDay: '',
        machine_capacity: '',
        fuel_type: '',
        location: '',
        description: '',
        category: '',
        type: '',
        transmission: '',
    })

    /* ================= FETCH PRODUCT ================= */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/owner/product/${id}`)
                if (data.succes) {
                    setProduct({
                        ...data.product,
                        features: data.product.features || [],
                    })
                    setFeatures(data.product.features || [])
                    setSeatingCapacity(data.product.seating_capacity || 0)

                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error("Gagal mengambil data produk")
            }
        }
        fetchProduct()
    }, [id, axios])

    console.log();


    /* ================= UTIL ================= */
    const isValidYear = (year) => {
        const current = new Date().getFullYear()
        return /^\d{4}$/.test(year) && year >= 1980 && year <= current
    }

    const addFeature = (value) => {
        if (!value || features.includes(value)) return

        const updatedFeatures = [...features, value]

        setFeatures(updatedFeatures)
        setProduct(prev => ({
            ...prev,
            features: updatedFeatures,
        }))
    }

    const removeFeature = (value) => {
        const updatedFeatures = features.filter(item => item !== value)

        setFeatures(updatedFeatures)
        setProduct(prev => ({
            ...prev,
            features: updatedFeatures,
        }))
    }

    /* ================= SUBMIT ================= */
    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (isLoading) return

        if (!isValidYear(product.year)) {
            return toast.error("Tahun tidak valid")
        }

        setIsLoading(true)

        try {
            const formData = new FormData()

            if (image) formData.append('image', image)

            formData.append(
                'updatedData',
                JSON.stringify({
                    ...product,
                    seating_capacity: product.type === "Mobil" ? seatingCapacity : undefined,
                    features: product.type === "Mobil" ? product.features : [],
                })
            )

            const { data } = await axios.post(
                `/api/owner/edit-product/${id}`,
                formData,
            )

            if (data.succes) {
                toast.success("Produk berhasil diperbarui")
                navigate('/owner/manage-products')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error("Terjadi kesalahan saat update")
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className='px-4 md:px-10 pt-10'>
            <Title
                title="Edit Kendaraan"
                image={assets.carIconColored}
                style="p-1 bg-white rounded-md h-8"
            />

            <form onSubmit={onSubmitHandler} className='grid grid-cols-12 gap-5 mt-6 mb-10 text-sm'>

                {/* ================= LEFT ================= */}
                <div className='bg-white p-10 rounded-md shadow-2xl/4 col-span-7 flex flex-col gap-5'>

                    {/* Image */}
                    <label className='flex items-center gap-5 cursor-pointer'>
                        <img
                            src={image ? URL.createObjectURL(image) : product.image}
                            className='h-20 rounded-lg'
                            alt=""
                        />
                        <input type="file" hidden accept='image/*' onChange={e => setImage(e.target.files[0])} />
                        <span className='text-gray-400'>Upload foto kendaraan</span>
                    </label>

                    {/* Type */}
                    <div className='flex gap-6 ms-auto'>
                        {types.map(item => (
                            <label key={item} className='flex gap-2'>
                                <input
                                    type="radio"
                                    value={item}
                                    checked={product.type === item}
                                    onChange={e => setProduct({ ...product, type: e.target.value })}
                                />
                                {item}
                            </label>
                        ))}
                    </div>

                    {/* Brand Model Category */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
                        {["brand", "model", "category"].map(field => (
                            <div key={field} className='flex flex-col w-full'>
                                <label className='text-gray-500'>Brand</label>
                                <input
                                    value={product[field]}
                                    onChange={e => setProduct({ ...product, [field]: e.target.value })}
                                    className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'
                                    placeholder={field}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {/* Year Price Machine */}
                    < div className='grid grid-cols-1, md:grid-cols-2 lg:grid-cols-3 gap-6' >
                        <div className='flex flex-col w-full'>
                            <label className='text-gray-500'>Tahun</label>
                            <input type="number" value={product.year} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'
                                onChange={e => setProduct({ ...product, year: e.target.value })} required />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='text-gray-500'>Harga harian(IDR)</label>
                            <input type="number" value={product.pricePerDay} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'
                                onChange={e => setProduct({ ...product, pricePerDay: e.target.value })} required />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='text-gray-500'>Kapasitas Mesin</label>
                            <input value={product.machine_capacity} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'
                                onChange={e => setProduct({ ...product, machine_capacity: e.target.value })} required />
                        </div>
                    </div>

                    <div className='grid grid-cols-1, md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {/* Transmisi */}
                        <div className='flex flex-col'>
                            <label className='text-gray-500'>Transmisi</label>
                            <select
                                value={product.transmission}
                                onChange={e => setProduct({ ...product, transmission: e.target.value })}
                                className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'
                                required
                            >
                                <option value="">Pilih transmisi</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Semi-Automatic">Semi-Automatic</option>
                            </select>
                        </div>

                        {/* Tipe Bahan Bakar */}
                        <div className='flex flex-col'>
                            <label className='text-gray-500'>Tipe bahan bakar</label>
                            <select
                                value={product.fuel_type}
                                onChange={e => setProduct({ ...product, fuel_type: e.target.value })}
                                className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'
                                required
                            >
                                <option value="">Pilih bahan bakar</option>
                                <option value="Bensin">Bensin</option>
                                <option value="Solar">Solar</option>
                                <option value="Gas">Gas</option>
                                <option value="Listrik">Listrik</option>
                            </select>
                        </div>


                        {/* Mobil only */}
                        {product.type === "Mobil" && (
                            <div className='flex flex-col w-full'>
                                <label className='text-gray-500'>Jumlah Kursi</label>
                                <input
                                    type="number"
                                    value={seatingCapacity}
                                    onChange={e => setSeatingCapacity(e.target.value)}
                                    placeholder="Jumlah Kursi"
                                    className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-400'
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Lokasi */}
                    <div className='flex flex-col'>
                        <label className='text-gray-500 mb-1'>Lokasi</label>
                        <select
                            value={product.location}
                            onChange={e => setProduct({ ...product, location: e.target.value })}
                            className='px-3 py-2 border rounded-md text-gray-500 outline-none'
                            required
                        >
                            <option value="">Pilih lokasi</option>
                            <option value="Purwokerto">Purwokerto</option>
                        </select>
                    </div>

                    <textarea
                        rows={5}
                        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-500'
                        value={product.description}
                        onChange={e => setProduct({ ...product, description: e.target.value })}
                        required
                    />

                    {product.type === "Motor" &&
                        <button className='bg-tombol py-3 rounded-xl text-white'>
                            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    }
                </div>

                {/* ================= RIGHT (FEATURES) ================= */}
                {product.type === "Mobil" && (
                    <div className='col-span-5 bg-white p-10 rounded-md shadow-2xl/4 sticky top-10'>

                        <div className='flex flex-wrap gap-2'>
                            {features.map((item, idx) => (
                                <span key={idx} onClick={() => removeFeature(item)}
                                    className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer'>
                                    {item} ✕
                                </span>
                            ))}
                        </div>

                        <select
                            className='mt-6 w-full border px-3 py-2'
                            onChange={e => {
                                addFeature(e.target.value)
                                e.target.value = ""
                            }}>
                            <option value="">Tambah fitur...</option>
                            {vehicleFeaturesOption.map((item, idx) =>
                                <option key={idx} value={item}>{item}</option>
                            )}
                        </select>

                        <button className='bg-tombol w-full py-3 mt-6 rounded-xl text-white'>
                            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default EditProduct
