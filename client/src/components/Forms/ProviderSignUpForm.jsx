import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const AREAS = [
    'Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur',
    'Gachibowli', 'Secunderabad', 'Ameerpet', 'Kukatpally',
    'LB Nagar', 'Dilsukhnagar', 'Begumpet', 'Mehdipatnam'
]

const SERVICES = [
    'Plumbing', 'Electrical work', 'House cleaning',
    'Carpentry & furniture repair', 'Painting & wall finishing',
    'Appliance repair', 'Tutoring & coaching',
    'Personal fitness training', 'Pest control',
    'Gardening & landscaping', 'Laundry & ironing', 'Beauty & grooming'
]

import { useLogin } from '../../context/LoginContext'
import { useUser } from '../../context/UserContex'

export default function ProviderSignUpForm() {

    const { verifyProviderLogin } = useLogin()
    const { fetchProviderData } = useUser()

    const navigate = useNavigate()

    const savedData = JSON.parse(sessionStorage.getItem('providerForm')) || {}

    const { register, handleSubmit, getValues, reset, watch, formState: { errors } } = useForm({
        defaultValues: savedData
    })

    const watchedData = watch()

    const [selectedServices, setSelectedServices] = useState(
        savedData.selectedServices || {}
    )
    const [serviceError, setServiceError] = useState('')

    useEffect(() => {
        const saved = JSON.parse(sessionStorage.getItem('providerForm'))

        if (saved) {
            if (saved.selectedServices) setSelectedServices(saved.selectedServices)
            if (saved.imagePreview) setPreview(saved.imagePreview)
        }
    }, [])

    useEffect(() => {

        if (!watchedData.name && !watchedData.email) return

        const dataToSave = {
            ...watchedData,
            selectedServices,
            imagePreview: preview
        }

        sessionStorage.setItem('providerForm', JSON.stringify(dataToSave))
    }, [watchedData, selectedServices])

    const handleServiceToggle = name => {
        setSelectedServices(prev => {
            if (name in prev) { const u = { ...prev }; delete u[name]; return u }
            return { ...prev, [name]: '' }
        })
    }

    const handlePriceChange = (name, price) =>
        setSelectedServices(prev => ({ ...prev, [name]: price }))

    const handleClear = () => {
        sessionStorage.removeItem('providerForm')
        reset()
    }

    const onSubmit = async (data) => {
        setServiceError('')

        const services = Object.entries(selectedServices).map(([category, price]) => ({
            category, price: Number(price)
        }))

        if (services.length === 0) return setServiceError('Please select at least one service.')
        if (services.some(s => !s.price)) return setServiceError('Enter a price for each selected service.')

        const { confirmPassword, selectedServices: _, ...cleanData } = data

        try {
            const res = await fetch('http://localhost:5000/api/signup/provider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...cleanData, services })
            })

            const result = await res.json()

            if (result.success) {
                sessionStorage.removeItem('providerForm')

                reset({
                    name: '', email: '', phone: '',
                    password: '', confirmPassword: '',
                    area: '', bio: ''
                })

                setSelectedServices({})
                verifyProviderLogin()
                fetchProviderData()
                navigate('/')
            } else {
                alert('Error creating provider: ' + (result.error || 'Unknown error'))
            }
        }
        catch (err) {
            console.log(err)
            alert('Error creating provider: ' + (err.message || 'Unknown error'))
        }
    }

    const inp = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition bg-gray-100"

    return (
        <div className="min-h-screen flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-4xl rounded-2xl p-8 shadow-md bg-[#e1e1e1]">

                <h2 className="text-xl font-semibold text-gray-800 mb-1">Register as a Provider</h2>
                <p className="text-sm text-gray-600 mb-6">Join our platform and start getting bookings in Hyderabad</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div className="grid grid-cols-2 gap-x-7 justify-items-center items-start">
                        <div className="flex flex-col gap-4">
                            <p className="text-sm font-medium text-gray-600 ">Personal Details</p>
                            <div>
                                <input {...register('name', { required: 'Name is required' })} placeholder="Full name" className={inp} />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Email & Password */}
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className={`${inp}`} />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' } })} type="tel" placeholder="Phone number" className={inp} />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">

                                    <div>
                                        <input {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} type="password" placeholder="Password" className={inp} />
                                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                                    </div>
                                    <div>
                                        <input {...register('confirmPassword', {
                                            required: 'Required', minLength: { value: 8, message: 'Min 8 characters' }, validate: value => value === getValues('password') || 'Passwords do not match'
                                        })} type="password" placeholder="Confirm Password" className={inp} />
                                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Area */}
                            <div>
                                <select {...register('area', { required: 'Please select your area' })} className={`${inp} text-gray-600`}>
                                    <option value="">Select your area</option>
                                    {AREAS.map(a => <option key={a}>{a}</option>)}
                                </select>
                                {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area.message}</p>}
                            </div>

                        </div>
                        <div className="min-w-full min-h-full">
                            {/* Services */}
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Services & pricing (₹)</p>
                                <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2 max-h-[17rem] overflow-y-auto">
                                    {SERVICES.map(s => (
                                        <div key={s} className="flex items-center gap-3">
                                            <input type="checkbox" id={s} checked={s in selectedServices}
                                                onChange={() => handleServiceToggle(s)}
                                                className="accent-violet-500 w-4 h-4 cursor-pointer flex-shrink-0" />
                                            <label htmlFor={s} className="text-sm text-gray-700 flex-1 cursor-pointer">{s}</label>
                                            <input type="number" min="0" placeholder="₹ Price"
                                                value={selectedServices[s] || ''}
                                                onChange={e => handlePriceChange(s, e.target.value)}
                                                disabled={!(s in selectedServices)}
                                                className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-violet-400 bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed" />
                                        </div>
                                    ))}
                                </div>
                                {serviceError && <p className="text-red-400 text-xs mt-1">{serviceError}</p>}
                            </div>

                        </div>
                    </div>
                    {/* Bio */}
                    <textarea {...register('bio')} rows={3}
                        placeholder="Short intro — your experience and why customers should hire you"
                        className={`${inp} resize-none h-[9rem]`} />

                    <button type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2.5 text-sm font-medium transition">
                        Submit for approval
                    </button>

                </form>

                <div className="flex justify-center items-center mt-5">
                    Already have an account?
                    <Link to="/login/provider" className="text-violet-600 hover:underline ml-1">
                        Log in
                    </Link>
                </div>
            </div>

        </div>
    )
}
