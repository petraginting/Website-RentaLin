import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProdctDetailPage from './pages/ProdctDetailPage'
import ProductsPage from './pages/ProductsPage'
import BookingPage from './pages/BookingPage'
import NavbarComponent from './components/layout/NavbarComponent'
import FooterComponent from './components/layout/FooterComponent'
import { Toaster } from "react-hot-toast"
import Layout from './pages/DashboardAdmin/Layout'
import Dashboard from './pages/DashboardAdmin/dashboard/Dashboard'
import AddProduct from './pages/DashboardAdmin/add_product/AddProduct'
import ManageProducts from './pages/DashboardAdmin/manage/product/ManageProducts'
import ManageBookings from './pages/DashboardAdmin/manage/booking/ManageBookings'
import NotFound404 from './pages/NotFound404'
import CheckOutPage from './pages/CheckOutPage'
import Login from './pages/Login'
import RegisterPage from './pages/RegisterPage'
import ProtectRoutes from './components/ProtectRoutes'
import ProfilePage from './pages/ProfilePage'
import EditProduct from './pages/DashboardAdmin/manage/product/EditProduct'
// import { useAppContext } from './context/Context'


const App = () => {

  // const navigate = useNavigate()
  // const { showLogin } = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith("/owner")
  const isLoginPath = useLocation().pathname.startsWith("/login")
  const isRegisterPath = useLocation().pathname.startsWith("/register")

  return (
    <>
      <Toaster />
      {!isOwnerPath && !isLoginPath && !isRegisterPath && <NavbarComponent />}

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/my-products' element={<ProductsPage />} />
        <Route path='/my-bookings' element={<BookingPage />} />
        <Route path='/detail-product/:id' element={<ProdctDetailPage />} />

        <Route element={<ProtectRoutes />}>
          <Route path='/checkout/:id' element={<CheckOutPage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Route>

        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-product' element={<AddProduct />} />
          <Route path='manage-products' element={<ManageProducts />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
          <Route path='edit-product/:id' element={<EditProduct />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />

      </Routes>

      {!isOwnerPath && !isLoginPath && !isRegisterPath && <FooterComponent />}

    </>
  )
}

export default App