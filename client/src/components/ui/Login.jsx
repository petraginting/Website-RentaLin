import React from 'react'
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/useAppContext';


const Login = () => {

  const { setShowLogin, axios, setToken, navigate } = useAppContext()

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!emailRegex.test(email)) return toast.error("Email tidak valid");

    if (password.length < 6) return toast.error("Password harus lebih dari 6 karakter");

    try {
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password })

      if (data.succes && data.token) {
        navigate('/')
        setToken(data.token)
        localStorage.setItem('token', data.token)
        setShowLogin(false)
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
    <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center text-sm text-gray-600 bg-gray-50'>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80  sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white" method='post'>
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
          </div>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
        </div>
        {state === "register" ? (
          <p>
            Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
          </p>
        ) : (
          <p>
            Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
          </p>
        )}
        <button className="bg-primary hover:bg-secondary transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>

    </div>
  )
}

export default Login



