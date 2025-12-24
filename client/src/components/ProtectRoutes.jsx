import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import NotFound404 from '../pages/NotFound404'

const ProtectRoutes = ({ children }) => {

    const { user, isAuthLoading } = useAppContext()

    if (isAuthLoading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <NotFound404 />
    }

    return children ? children : <Outlet />
}

export default ProtectRoutes
