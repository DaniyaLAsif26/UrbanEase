import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginContext = createContext()

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

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

            setIsUserLoggedIn(data.success)
        }
        catch (err) {
            console.log(err)
            setIsUserLoggedIn(false)
        }
        finally {
            setIsUserLoaded(true)
        }
    }

    useEffect(() => {
        verifyUserLogin()
    }, [])

    return (
        <LoginContext.Provider value={
            {
                isUserLoaded,
                isUserLoggedIn,
                verifyUserLogin
            }
        }
        >
            {children}
        </LoginContext.Provider>
    )
}

export const useLogin = () => useContext(LoginContext)