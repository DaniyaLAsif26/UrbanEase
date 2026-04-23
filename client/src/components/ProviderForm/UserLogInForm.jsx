import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const AREAS = [
    'Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur',
    'Gachibowli', 'Secunderabad', 'Ameerpet', 'Kukatpally',
    'LB Nagar', 'Dilsukhnagar', 'Begumpet', 'Mehdipatnam'
]

export default function UserLogInForm() {

    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const { register, handleSubmit, getValues, trigger, formState: { errors } } = useForm()

    const handleNext = async () => {
        const valid = await trigger(['name', 'email', 'password', 'confirmPassword', 'phone'])
        if (valid) setStep(2)
    }

    const onSubmit = async (data) => {
        const { confirmPassword, area, street, landmark, ...rest } = data

        const cleanData = {
            ...rest,
            address: { area, street, landmark }  
        }

        // console.log(cleanData)

        try {
            const res = await fetch('http://localhost:5000/api/login/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData )
            })

            const data = await res.json()
            console.log(data)

            if (data.success) {
                console.log(data.user)
                navigate('/')
            }
            else {
                alert(data.error || 'Unknown error')
            }

        }
        catch (err) {
            console.log('hi')
            console.log(err.message)
        }
    }

    const inp = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition bg-gray-100"

    return (
        <div className="min-h-screen flex items-start py-16 justify-center px-4">
            <div className="w-full max-w-md rounded-2xl p-8 shadow-md bg-[#e1e1e1]">

                <div className="flex items-center gap-2 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step === 1 ? 'bg-violet-600 text-white' : 'bg-violet-200 text-violet-700'}`}>1</div>
                    <div className={`flex-1 h-0.5 ${step === 2 ? 'bg-violet-600' : 'bg-gray-300'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step === 2 ? 'bg-violet-600 text-white' : 'bg-gray-300 text-gray-500'}`}>2</div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {step === 1 ? 'Create an account' : 'Your address'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    {step === 1 ? 'Enter your details to get started' : 'Tell us where you need services'}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {step === 1 && (
                        <>
                            <div>
                                <input {...register('name', { required: 'Name is required' })} placeholder="Full name" className={inp} />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className={inp} />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' } })} type="tel" placeholder="Phone number" className={inp} />
                                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <input {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} type="password" placeholder="Password" className={inp} />
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <input {...register('confirmPassword', {
                                    required: 'Required',
                                    validate: value => value === getValues('password') || 'Passwords do not match'
                                })} type="password" placeholder="Confirm password" className={inp} />
                                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                            </div>

                            <button type="button" onClick={handleNext}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2.5 text-sm font-medium transition">
                                Next
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <select {...register('area', { required: 'Please select your area' })} className={`${inp} text-gray-600`}>
                                    <option value="">Select your area</option>
                                    {AREAS.map(a => <option key={a}>{a}</option>)}
                                </select>
                                {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area.message}</p>}
                            </div>

                            <div>
                                <input {...register('street', { required: 'Street address is required' })} placeholder="Street / flat / building" className={inp} />
                                {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>}
                            </div>

                            <div>
                                <input {...register('landmark')} placeholder="Landmark (optional)" className={inp} />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(1)}
                                    className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition">
                                    Back
                                </button>
                                <button type="submit"
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2.5 text-sm font-medium transition">
                                    Register
                                </button>
                            </div>
                        </>
                    )}

                </form>
            </div>
        </div>
    )
}