import React, { useCallback, useEffect, useState } from 'react'
import Title from '../../../../components/owner/Title'
import toast from 'react-hot-toast'
import Swal from "sweetalert2"
import { useAppContext } from '../../../../context/useAppContext'
import { header_product_manage } from '../../../../utils/datas'
import TableProducts from './TableProducts'
import { assets } from '../../../../assets/assets'

const ManageProducts = () => {

  const { isOwner, axios } = useAppContext()

  const [products, setProducts] = useState([])

  const fetchOwnerProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/owner/products")

      data.succes ? setProducts(data.products) : toast.error(data.message)

    } catch (error) {
      console.log(error.message);

    }
  }, [axios])

  const toggleAvailability = async (productId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-product", { productId })

      if (data.succes) {
        toast.success(data.message)
        fetchOwnerProducts()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error.message);

    }
  }

  const deleteProduct = async (productId) => {
    try {

      const result = await Swal.fire({
        title: "Apa kamu yakin?",
        text: "Anda tidak dapat mengembalikannya!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!"
      })

      if (!result.isConfirmed) return

      const { data } = await axios.post("/api/owner/delete-product", { productId })

      if (data.succes) {
        Swal.fire({
          title: "Hapus!",
          text: "Kendaraan berhasil dihapus.",
          icon: "success"
        })
        fetchOwnerProducts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    isOwner && fetchOwnerProducts()
  }, [isOwner, fetchOwnerProducts])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title
        title="Mengelola Kendaraan RentaLin"
        image={assets.carIconColored}
        style="p-1 bg-white rounded-md h-8"
      />

      <TableProducts
        header={header_product_manage}
        datas={products}
        deleteProduct={deleteProduct}
        toggleAvailability={toggleAvailability}
      />
    </div>
  )
}

export default ManageProducts
