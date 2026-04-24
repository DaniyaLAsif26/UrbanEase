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

    useEffect(() => {
        verifyUserLogin()
        verifyProviderLogin()
    }, [])

    return (
        <LoginContext.Provider value={
            {
                isUserLoaded,
                isUserLoggedIn,
                verifyUserLogin,

                isProviderLoaded,
                isProviderLoggedIn,
                verifyProviderLogin,
            }
        }
        >
            {children}
        </LoginContext.Provider>
    )
}

export const useLogin = () => useContext(LoginContext)