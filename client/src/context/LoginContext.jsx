import { createContext, useContext, useState, useEffect } from "react";

const LoginContext = createContext()

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

import { useUser } from './UserContext'

export const LoginProvider = ({ children }) => {

    const { fetchUserData, fetchProviderData } = useUser()

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [isProviderLoggedIn, setIsProviderLoggedIn] = useState(false)
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

    const [isUserLoaded, setIsUserLoaded] = useState(false)
    const [isProviderLoaded, setIsProviderLoaded] = useState(false)
    const [isAdminLoaded, setIsAdminLoaded] = useState(false)

    const verifyUserLogin = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/login/verify/user`, {
                method: "GET",
                credentials: "include"
            })

            const data = await res.json()
            if (data.success) {
                setIsUserLoggedIn(data.success)
                fetchUserData()
            }

        }
        catch (err) {
            console.log(err)
            setIsUserLoggedIn(false)
        }
        finally {
            setIsUserLoaded(true)
        }
    }

    const verifyProviderLogin = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/login/verify/provider`, {
                method: "GET",
                credentials: "include"
            })

            const data = await res.json()

            if (data.success) {
                setIsProviderLoggedIn(data.success)
                fetchProviderData()
            }

        }
        catch (err) {
            console.log(err)
            setIsProviderLoggedIn(false)
        }
        finally {
            setIsProviderLoaded(true)
        }
    }
    const verifyAdminLogin = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/login/verify/admin`, {
                method: "GET",
                credentials: "include"
            })

            const data = await res.json()

            if (data.success) {
                setIsAdminLoggedIn(data.success)
            }

        }
        catch (err) {
            console.log(err)
            setIsAdminLoggedIn(false)
        }
        finally {
            setIsAdminLoaded(true)
        }
    }

    useEffect(() => {
        verifyUserLogin()
        verifyProviderLogin()
        verifyAdminLogin()
    }, [])

    const logoutAdmin = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/logout/admin`, {
                method: 'DELETE',
                credentials: "include"
            })

            const dataRes = await res.json()

            if (dataRes.success === true) {
                setIsAdminLoggedIn(false)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const logoutUser = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/logout/user`, {
                method: "DELETE",
                credentials: 'include'
            })

            const dataRes = await res.json()

            setIsUserLoggedIn(false)
            fetchUserData()
            return;
        }
        catch (err) {
            console.log("hello")
            console.log(err)
            alert("Error", err.message)
        }
    }

    const logoutProvider = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/logout/provider`, {
                method: "DELETE",
                credentials: 'include'
            })

            const dataRes = await res.json()

            setIsUserLoggedIn(false)
            fetchProviderData()
            return;
        }
        catch (err) {
            console.log(err)
            alert("Error", err.message)
        }
    }

    return (
        <LoginContext.Provider value={
            {
                isUserLoaded,
                isUserLoggedIn,
                verifyUserLogin,

                isProviderLoaded,
                isProviderLoggedIn,
                verifyProviderLogin,

                isAdminLoaded,
                isAdminLoggedIn,
                verifyAdminLogin,

                logoutAdmin,
                logoutUser,
                logoutProvider
            }
        }
        >
            {children}
        </LoginContext.Provider>
    )
}

export const useLogin = () => useContext(LoginContext)