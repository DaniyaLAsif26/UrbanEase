import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function ProviderLoginForm({ isUser = false }) {
    const navigate = useNavigate()
    const [loginType, setLoginType] = useState('email') // 'email' | 'phone'
    const [showPass, setShowPass] = useState(false)
    const [globalError, setGlobalError] = useState('')
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm()

    const inp = "w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"

    const onSubmit = async (data) => {
        setGlobalError('')
        setLoading(true)

        const identifier = loginType === 'email' ? data.email : data.phone

        const endPoint = isUser ?
            'http://localhost:5000/api/login/user'
            :
            'http://localhost:5000/api/login/provider'

        try {
            const res = await fetch(endPoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, loginType, password: data.password })
            })

            const result = await res.json()

            if (result.success) {
                navigate('/')
            } else {
                setGlobalError(result.error || 'Invalid credentials. Please try again.')
            }
        } catch (err) {
            setGlobalError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-md rounded-2xl p-8 shadow-md bg-[#e1e1e1]">

                {/* Header */}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
                    {isUser ? 'User Portal' : 'Provider Portal'}

                </span>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome back</h2>
                <p className="text-sm text-gray-500 mb-6">Sign in to manage your bookings and services</p>

                {/* Tab toggle */}
                <div className="flex bg-gray-300 rounded-xl p-1 mb-5 gap-1">
                    {['email', 'phone'].map(tab => (
                        <button key={tab} type="button"
                            onClick={() => { setLoginType(tab); setGlobalError('') }}
                            className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${loginType === tab
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {tab === 'email' ? 'Email' : 'Phone number'}
                        </button>
                    ))}
                </div>

                {/* Global error */}
                {globalError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5 mb-4">
                        {globalError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email or Phone */}
                    {loginType === 'email' ? (
                        <div>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                                })}
                                type="email" placeholder="Email address" className={inp} />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    ) : (
                        <div>
                            <input
                                {...register('phone', {
                                    required: 'Phone number is required',
                                    pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' }
                                })}
                                type="tel" placeholder="10-digit mobile number" maxLength={10} className={inp} />
                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Min 8 characters' }
                                })}
                                type={showPass ? 'text' : 'password'}
                                placeholder="Password" className={`${inp} pr-10`} />
                            <button type="button" onClick={() => setShowPass(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                                {showPass ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Forgot password */}
                    <div className="flex justify-end -mt-1">
                        <a href="#" className="text-xs text-violet-600 font-medium hover:underline">Forgot password?</a>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium transition">
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-5 text-gray-400 text-xs">
                    <span className="flex-1 h-px bg-gray-300" />or<span className="flex-1 h-px bg-gray-300" />
                </div>

                <p className="text-center text-sm text-gray-500">
                    {isUser ?
                        <> New user?{' '}</>
                        :
                        <>New provider?{' '}</>
                    }
                    <a href={isUser ? "/register/user" : "/register/provider"} className="text-violet-600 font-semibold hover:underline">Register here</a>
                </p>
            </div>
        </div>
    )
}