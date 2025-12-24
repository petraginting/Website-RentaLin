import React from "react";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Login = () => {
    const { axios, navigate, fetchUser } = useAppContext()

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (password.length < 6) return toast.error("Password harus lebih dari 6 karakter");

        try {
            const { data } = await axios.post(`/api/user/login`, { username, password }, { withCredentials: true })

            if (data.succes) {
                await fetchUser()
                navigate('/')
                toast.success("Login berhasil")
            } else {
                console.error(data.message)
                toast.error("Login gagal")
            }

        } catch (error) {
            toast.error(error.message)
        }

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex h-screen w-full">
                <div className="w-full hidden md:inline-block bg-gray-500">
                    <img
                        src={assets.banner_login}
                        alt="leftSideImage"
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="w-full flex flex-col items-center justify-center">
                    <form onSubmit={onSubmitHandler} className="md:w-96 w-80 flex flex-col items-center justify-center">
                        <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
                        <p className="text-sm text-gray-500/90 mb-6 mt-3">
                            Welcome back! Please sign in to continue
                        </p>

                        <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg
                                className="mr-2"
                                width="16"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 15.75v-1.5a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1.5m9-10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
                                    stroke="#6B7280"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <input
                                type="username"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                                required
                            />
                        </div>

                        <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg
                                className="mr-2"
                                width="13"
                                height="17"
                                viewBox="0 0 13 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                    fill="#6B7280"
                                />
                            </svg>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                                required
                            />
                        </div>


                        <button
                            type="submit"
                            className="mt-8 w-full h-11 rounded-full text-white bg-tombol hover:opacity-90 transition-opacity"
                        >
                            Login
                        </button>
                        <p className="text-gray-500/90 text-sm mt-4">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-tombol/80 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Login;



