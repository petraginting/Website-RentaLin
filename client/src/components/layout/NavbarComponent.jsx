import { Link, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import { assets, menuLinks } from '../../assets/assets'
import { useAppContext } from '../../context/useAppContext'

const NavbarComponent = () => {

    const { user, logout, isOwner, navigate, isAuthLoading } = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)

    const initialProfile = {
        username: user ? user.username : "User",
        name: user ? user.first_name + " " + user.last_name : "User Name",
        avatarUrl: user ? user.image : null
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        const first = parts[0]?.[0] ?? "";
        const last = parts[1]?.[0] ?? "";
        return (first + last || first).toUpperCase();
    };


    const options = ["Akun saya", "Logout"];
    const path = () => {
        return navigate("/profile");
    };


    return (
        <div className={`flex z-100 items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-5 text-gray-600 relative transition-all ${location.pathname === "/" && "bg-white"}`}>
            <Link to="/">
                <h1 className='text-4xl font-semibold text-tombol'>RentaLin.</h1>
            </Link>

            <div className={`max-sm:fixed max-sm:h-screen max-sm:bg-white border-borderColor max-sm:w-full flex max-sm:border-t max-sm:top-16 flex-col right-0 sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-999 ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
                {menuLinks.map((link, idx) => (
                    <Link key={idx} to={link.path} onClick={() => setOpen(false)}>
                        {link.name}
                    </Link>
                ))}

                <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>


                    {user ? (
                        <>
                            <button onClick={() => navigate("/owner")} className={isOwner ? 'cursor-pointer border border-tombol hover:bg-transparent hover:text-gray-600 bg-tombol text-white px-6 py-1.5 rounded-full' :""}>{isOwner ? "Dashboard" : ""}</button>
                            <div
                                className="flex flex-col w-44 text-sm relative"
                                onMouseEnter={() => setOpen(true)}
                                onMouseLeave={() => setOpen(false)}
                            >
                                <div
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => path()}
                                >
                                    <div className="h-11 w-11 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-semibold overflow-hidden">
                                        {initialProfile.avatarUrl ? (
                                            <img
                                                src={initialProfile.avatarUrl}
                                                alt={initialProfile.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span>{getInitials(initialProfile.name)}</span>
                                        )}
                                    </div>
                                    <p>{initialProfile.username}</p>
                                </div>

                                {open && (
                                    <ul className="w-full absolute bg-white border border-gray-300 rounded shadow-md top-10 py-2">
                                        {options.map((option) => (
                                            <div
                                                onClick={() => option === "Akun saya" ? navigate("/profile") : logout()}
                                                key={option}
                                                className="flex px-4 py-2 hover:bg-tombol/90 hover:text-white cursor-pointer"
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    ) : (
                        !isAuthLoading &&
                        <button onClick={() => navigate("/login")} className="cursor-pointer px-8 py-2 rounded-lg text-white transition-all bg-tombol hover:bg-primary">Masuk</button>

                    )}

                </div>


            </div>

            <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={() => setOpen(!open)}>
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>

        </div>
    )
}

export default NavbarComponent
