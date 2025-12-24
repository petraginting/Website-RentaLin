import NavbarOwner from '../../components/owner/NavbarOwner'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/owner'
import { useAppContext } from '../../context/useAppContext'

const Layout = () => {

  const { isOwner, isAuthLoading } = useAppContext()

  if (isAuthLoading) return <h1>loading...</h1>

  return (
    <>
      {!isOwner ? window.location.replace("/")
        :
        <div className='flex'>
          <Sidebar />

          <div className='w-full bg-light'>
            <NavbarOwner />
            <Outlet />
          </div>
        </div>
      }
    </>
  )
}

export default Layout
