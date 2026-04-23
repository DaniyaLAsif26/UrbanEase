import { Routes, Route } from "react-router-dom"

import HomePage from "../pages/HomePage.jsx"
import AllServices from "../pages/ServicesPage.jsx"
import ProviderLogInPage from "../pages/ProviderLogInPage.jsx"
import UserLogInPage from "../pages/UserLogInPage.jsx"

export default function AppRoutes() {
    return (

        <Routes>
            <Route path="/" element={<HomePage />}
            />

            <Route path="/home" element={<HomePage />}
            />

            <Route path="/services" element={<AllServices />}
            />

            <Route path="/register/provider" element={<ProviderLogInPage />}
            />

            <Route path="/register/user" element={<UserLogInPage />}
            />
        </Routes>
    )
}