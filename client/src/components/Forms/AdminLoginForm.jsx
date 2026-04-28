import { useState } from "react"
import { useNavigate } from 'react-router-dom'

import { useLogin } from "../../context/LoginContext"

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export default function AdminLoginForm() {

    const { verifyAdminLogin } = useLogin()

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')

    const loginAdmin = async (e) => {
        e.preventDefault()

        try {
            const login = await fetch(`${BackEndRoute}/api/login/admin`, {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, pass })
            })

            const res = await login.json()

            if (res.success) {
                verifyAdminLogin()
                navigate('/admin/panel')
            }
            else {
                alert(res.error)
            }
        }
        catch (err) {
            console.log(err)
            alert(err)
        }
    }

    return (
        <div className="pt-16 pb-20">

            <div
                className="max-w-md mx-auto relative overflow-hidden z-10 bg-gray-800 p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-purple-600 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-sky-400 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12"
            >
                <h2 className="text-2xl font-bold text-white mb-6">
                    Admin Login
                </h2>

                <form onSubmit={loginAdmin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">
                            Admin Name
                        </label>
                        <input
                            className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                            type="text"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                            type="password"
                            required
                            onChange={(e) => setPass(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end mt-9">
                        <button
                            className="bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 text-white px-4 py-2 font-bold rounded-md hover:opacity-80"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}