import { useCallback, useEffect, useState } from 'react'
import { toast } from "react-hot-toast"
import { Navigate, useNavigate } from 'react-router-dom'
import axios from "axios"
import { AppContext } from './useAppContext'

axios.defaults.baseURL = import.meta.env.VITE_BASED_API_URL
axios.defaults.withCredentials = true;

export const AppProvider = ({ children }) => {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loadingOwner, setLoadingOwner] = useState(true)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const [products, setProducts] = useState([])

  const fetchUser = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const { data } = await axios.get(`/api/user/data?t=${timestamp}`, { withCredentials: true });

      if (data.succes) {
        setIsOwner(data.user.role === "owner");
        setUser(data.user);
      } else {
        console.log(data.message);
        setUser(null);
      }

    } catch (error) {
      setUser(null);
      console.error(error);
    } finally {
      setLoadingOwner(false);
      setIsAuthLoading(false);
    }
  }, [])


  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/user/products');
      data.succes ? setProducts(data.products) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/user/logout", { withCredentials: true });

      if (data.succes) {
        setUser(null);
        setIsOwner(false);
        navigate("/login");
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    fetchUser()
    fetchProducts()
  }, [fetchUser])

  const value = {
    user, setUser,
    loadingOwner, isOwner, setIsOwner,
    showLogin, setShowLogin,
    pickupDate, setPickupDate,
    returnDate, setReturnDate,
    navigate, products, setProducts,
    logout, axios, fetchUser, fetchProducts, isAuthLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
