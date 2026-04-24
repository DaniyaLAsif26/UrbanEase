import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext()
const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null)
    const [providerData, setProviderData] = useState(null)

    const fetchUserData = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/profile/user`, {
                credentials: "include"
            })
            const data = await res.json()

            if (data.success) setUserData(data.user)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchProviderData = async () => {
        try {
            const res = await fetch(`${BackEndRoute}/api/profile/provider`, {
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) setProviderData(data.provider)
        } catch (err) {
            console.log(err)
        }
    }

    const updateUserData = (updatedFields) => {
        setUserData(prev => ({ ...prev, ...updatedFields }))
    }

    const updateProviderData = (updatedFields) => {
        setProviderData(prev => ({ ...prev, ...updatedFields }))
    }

    const clearUserData = () => setUserData(null)
    const clearProviderData = () => setProviderData(null)

    return (
        <UserContext.Provider value={{
            userData,
            providerData,
            fetchUserData,
            fetchProviderData,
            updateUserData,
            updateProviderData,
            clearUserData,
            clearProviderData
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)