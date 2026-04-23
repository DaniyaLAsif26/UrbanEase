import { useState, useRef, useEffect } from 'react'
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

export default function ProviderForm() {

    const savedData = JSON.parse(sessionStorage.getItem('providerForm')) || {}

    const { register, handleSubmit, getValues, watch, formState: { errors } } = useForm({
        defaultValues: savedData
    })

    const watchedData = watch()

    const [selectedServices, setSelectedServices] = useState(
        savedData.selectedServices || {}
    )
    const [preview, setPreview] = useState(null)
    const [image, setImage] = useState(null)
    const [serviceError, setServiceError] = useState('')
    const fileRef = useRef()

    useEffect(() => {
        const saved = JSON.parse(sessionStorage.getItem('providerForm'))

        if (saved) {
            if (saved.selectedServices) setSelectedServices(saved.selectedServices)
            if (saved.imagePreview) setPreview(saved.imagePreview)
        }
    }, [])

    useEffect(() => {
        const dataToSave = {
            ...watchedData,
            selectedServices,
            imagePreview: preview
        }

        sessionStorage.setItem('providerForm', JSON.stringify(dataToSave))
    }, [watchedData, selectedServices, preview])

    const handleImageChange = e => {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleServiceToggle = name => {
        setSelectedServices(prev => {
            if (name in prev) { const u = { ...prev }; delete u[name]; return u }
            return { ...prev, [name]: '' }
        })
    }

    const handlePriceChange = (name, price) =>
        setSelectedServices(prev => ({ ...prev, [name]: price }))

    const onSubmit = async (data) => {
        setServiceError('')

        console.log('hello')

        const services = Object.entries(selectedServices).map(([category, price]) => ({
            category, price: Number(price)
        }))

        if (services.length === 0) return setServiceError('Please select at least one service.')
        if (services.some(s => !s.price)) return setServiceError('Enter a price for each selected service.')
        if (!image) return setServiceError('Profile photo is required.')

        const { confirmPassword, selectedServices: _, ...cleanData } = data

        const formData = new FormData()
        formData.append('profilePhoto', image)
        formData.append('data', JSON.stringify({ ...cleanData, services }))


        try {
            const res = await fetch('http://localhost:5000/api/login/provider', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
        }
        catch (err) {
            console.log(err)
        }
    }

    const inp = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition bg-gray-100"

    return (
        <div className="min-h-screen flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-xl rounded-2xl p-8 shadow-md bg-[#e1e1e1]">

                <h2 className="text-xl font-semibold text-gray-800 mb-1">Register as a Provider</h2>
                <p className="text-sm text-gray-600 mb-6">Join our platform and start getting bookings in Hyderabad</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Profile Image */}
                    <div className="flex items-center gap-4">
                        <div onClick={() => fileRef.current.click()}
                            className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden bg-white hover:border-violet-400 transition">
                            {preview
                                ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                : <span className="text-2xl text-gray-300">+</span>}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Profile photo</p>
                            <p className="text-xs text-gray-400">Click to upload</p>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>

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

                    {/* Services */}
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Services & pricing (₹)</p>
                        <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2 max-h-64 overflow-y-auto">
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

                    {/* Bio */}
                    <textarea {...register('bio')} rows={3}
                        placeholder="Short intro — your experience and why customers should hire you"
                        className={`${inp} resize-none`} />

                    <button type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2.5 text-sm font-medium transition">
                        Submit for approval
                    </button>

                </form>
            </div>
        </div>
    )
}
