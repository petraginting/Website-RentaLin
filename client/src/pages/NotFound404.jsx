import React from 'react'

const NotFound404 = () => {
    return (
        <div className="flex flex-col items-center justify-center text-sm max-md:px-4 mt-6">
            <h1 className="text-8xl md:text-9xl font-bold text-primary/30">404</h1>
            <div className="h-1 w-16 rounded bg-primary/30 my-5 md:my-7"></div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800/50">Halaman tidak ditemukan</p>
        </div>
    )
}

export default NotFound404
