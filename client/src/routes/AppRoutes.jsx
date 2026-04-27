import { Routes, Route } from "react-router-dom"

import HomePage from "../pages/HomePage.jsx"
import AllServices from "../pages/ServicesPage.jsx"
import ProviderSignUpPage from "../pages/ProviderSignUpPage.jsx"
import UserSignUpPage from "../pages/UserSignUpPage.jsx"
import ProviderLogInPage from "../pages/ProviderLogInPage.jsx"
import UserLogInPage from "../pages/UserLogInPage.jsx"

import HosueCleaningPage from "../pages/Services/HouseCleaningPage.jsx"
import LaundryIroningPage from "../pages/Services/LaundryIroningPage.jsx"

import UserProfilePage from '../pages/UserProfilePage.jsx'
import ProviderProfilePage from '../pages/ProviderProfilePage.jsx'
import ServiceProvidersPage from '../pages/ServiceProvidersPage.jsx'
import RequestsPage from "../pages/RequestsPage.jsx"

export default function AppRoutes() {
    return (

        <Routes>
            <Route path="/" element={<HomePage />}
            />

            <Route path="/home" element={<HomePage />}
            />

            <Route path="/services" element={<AllServices />}
            />

            <Route path="/register/provider" element={<ProviderSignUpPage />}
            />

            <Route path="/register/user" element={<UserSignUpPage />}
            />

            <Route path="/login/provider" element={<ProviderLogInPage />}
            />

            <Route path="/login/user" element={<UserLogInPage />}
            />

            <Route path="/services/house-cleaning" element={<HosueCleaningPage />} />
            <Route path="/services/laundry-ironing" element={<LaundryIroningPage />} />

            <Route path="/service/providers/:bookingId" element={<ServiceProvidersPage />} />

            <Route path="/profile/user" element={<UserProfilePage />} />

            <Route path="/profile/provider" element={<ProviderProfilePage />} />
            
            <Route path="/bookings/requests" element={<RequestsPage />} />
        </Routes>
    )
}