import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useUser } from '../../../context/UserContext'
import { useLogin } from '../../../context/LoginContext'

import { areas } from '../../../data/services.js'

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

const TIME_SLOTS = [
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '13:00 PM', '14:00 PM', '15:00 PM', '16:00 PM', '17:00 PM', '18:00 PM',
]

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '5+ BHK']

const BHK_HOURS = {
    '1 BHK': '2 hours', '2 BHK': '3 hours', '3 BHK': '4 hours',
    '4 BHK': '5 hours', '5 BHK': '6 hours', '5+ BHK': '6+ hours',
}

const today = new Date().toISOString().split('T')[0]

export default function HouseCleaning() {
    const { userData } = useUser()
    const { isUserLoaded, isUserLoggedIn } = useLogin()
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '', phone: '', email: '',
            address: {
                area: '',
                street: '',
                landmark: '',
            },
            bhk: '',
            date: '',
            startTimeSlot: '',
            endTimeSlot: '',
        },
        mode: 'onTouched',
    })

    useEffect(() => {
        if (isUserLoaded && isUserLoggedIn && userData) {
            if (userData.name) setValue('name', userData.name)
            if (userData.phone) setValue('phone', userData.phone)
            if (userData.email) setValue('email', userData.email)
            if (userData.address.street) setValue('address.street', userData.address.street)
            if (userData.address.landmark) setValue('address.landmark', userData.address.landmark)
            if (userData.address.area) {
                const match = areas.find(
                    a => a.toLowerCase() === userData.address.area.toLowerCase()
                )
                setValue('address.area', match || 'Other')
            }
        }
    }, [isUserLoaded, isUserLoggedIn, userData, setValue])

    const watchedBhk = watch('bhk')

    const onSubmit = async (data) => {
        setSubmitting(true)

        const finalData = {
            ...data,
            serviceType: "House cleaning",
            status: 'draft',
            serviceDetails: {
                bhk: Number(data.bhk.split(' ')[0])
            }
        }

        try {
            const res = await fetch(`${BackEndRoute}/api/booking`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            })
            const result = await res.json()

            if (result.success) {
                const { bookingData } = result
                navigate(`/service/providers/${bookingData._id}?service=${bookingData.serviceType}&area=${bookingData.address.area}&duration=${bookingData.duration}&bhk=${watchedBhk}`,
                    { replace: true }
                )
            }
            else alert(result.error || 'Something went wrong')
        } catch {
            alert('Error submitting booking')
        } finally {
            setSubmitting(false)
        }
    }

    const inputCls = (hasError) =>
        `w-full h-12 px-4 bg-white text-gray-800 text-sm font-medium border-2 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300 ${hasError
            ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50'
            : 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50'
        }`

    const selectCls = (hasError) => `${inputCls(hasError)} cursor-pointer appearance-none pr-10`

    const Chevron = () => (
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    )

    const Err = ({ error }) => error ? (
        <p className="text-[11px] text-red-500 mt-1 ml-0.5">{error.message}</p>
    ) : null

    return (
        <div className="min-h-screen" style={{ fontFamily: "'Nunito', sans-serif", background: '#f8f9fa' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Sora:wght@700;800&display=swap');
                .hero {
                    background:
                        linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%),
                        url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80') center/cover no-repeat;
                    min-height: 380px;
                }
                .card { box-shadow: 0 24px 64px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06); }
                .btn-green {
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    transition: all 0.18s ease;
                }
                .btn-green:hover:not(:disabled) {
                    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                    box-shadow: 0 8px 24px rgba(22,163,74,0.40);
                    transform: translateY(-1px);
                }
                .btn-green:active { transform: translateY(0); }
                .lbl {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #9ca3af;
                    margin-bottom: 6px;
                }
            `}</style>

            {/* ─── Hero banner ─── */}
            <div className="hero flex flex-col items-center justify-center text-center px-4 pt-12 pb-24">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
                    Hyderabad's Trusted Service
                </span>
                <h1
                    className="text-white text-4xl sm:text-5xl font-extrabold mb-3 drop-shadow-lg"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    House Cleaning
                </h1>
                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <svg className="w-5 h-5" viewBox="0 0 20 20">
                            <defs><linearGradient id="hg"><stop offset="60%" stopColor="#fbbf24" /><stop offset="60%" stopColor="#d1d5db" /></linearGradient></defs>
                            <path fill="url(#hg)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <span className="text-white font-bold text-sm">4.8</span>
                    <span className="text-white/70 text-sm underline cursor-pointer">24,231 Reviews</span>
                </div>
            </div>

            {/* ─── Floating form card ─── */}
            <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10 pb-20">
                <div className="card bg-white rounded-2xl overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-7 sm:p-8">

                            {/* ── Row 1: Area · BHK · Date · Time ── */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                                {/* Area */}
                                <div className="relative">
                                    <label className="lbl">Area</label>
                                    <div className="relative">
                                        <select className={selectCls(!!errors.area)}
                                            {...register('address.area', { required: 'Required' })}>
                                            <option value="">Area</option>
                                            {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                        <Chevron />
                                    </div>
                                    <Err error={errors.area} />
                                </div>

                                {/* BHK */}
                                <div className="relative">
                                    <label className="lbl">Home size</label>
                                    <div className="relative">
                                        <select className={selectCls(!!errors.bhk)}
                                            {...register('bhk', { required: 'Required' })}>
                                            <option value="">BHK</option>
                                            {BHK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <Chevron />
                                    </div>
                                    <Err error={errors.bhk} />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="lbl">Date</label>
                                    <input type="date" min={today}
                                        className={inputCls(!!errors.date)}
                                        {...register('date', { required: 'Required' })} />
                                    <Err error={errors.date} />
                                </div>

                                {/* Time */}
                                <div className="relative">
                                    <label className="lbl">Start Time</label>
                                    <div className="relative">
                                        <select className={selectCls(!!errors.startTimeSlot)}
                                            {...register('startTimeSlot', {
                                                required: 'Required',


                                            })}

                                        >
                                            <option value="">Time</option>
                                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <Chevron />
                                    </div>
                                    <Err error={errors.startTimeSlot} />
                                </div>
                                <div className="relative">
                                    <label className="lbl">End Time</label>
                                    <div className="relative">
                                        <select className={selectCls(!!errors.endTimeSlot)}
                                            {...register('endTimeSlot', {
                                                required: 'Required',
                                                validate: (endTime) => {
                                                    const startTime = getValues('startTimeSlot')
                                                    if (!startTime) return true

                                                    if (endTime === startTime) return 'End time cannot be same as start time'
                                                    if (endTime < startTime) return 'End time cannot be before start time'

                                                    return true
                                                }
                                            })}>
                                            <option value="">Time</option>
                                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <Chevron />
                                    </div>
                                    <Err error={errors.endTimeSlot} />
                                </div>
                            </div>

                            {/* ── Divider ── */}
                            <div className="h-px bg-gray-100 my-5" />

                            {/* ── Row 2: Street · Landmark ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div>
                                    <label className="lbl">Street / Flat</label>
                                    <input type="text" placeholder="Flat 4B, Sunshine Apartments"
                                        className={inputCls(!!errors.street)}
                                        {...register('address.street', { required: 'Street address required' })} />
                                    <Err error={errors.street} />
                                </div>
                                <div>
                                    <label className="lbl">Landmark <span className="normal-case font-normal tracking-normal text-gray-300">(optional)</span></label>
                                    <input type="text" placeholder="Near Central Mall"
                                        className={inputCls(false)}
                                        {...register('address.landmark')} />
                                </div>
                            </div>

                            {/* ── Divider ── */}
                            <div className="h-px bg-gray-100 my-5" />

                            {/* ── Row 3: Phone · Email · Button ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                                <div>
                                    <label className="lbl">Phone <span className="normal-case font-normal  tracking-normal text-gray-300">(optional)</span></label>
                                    <input type="tel" placeholder="9876543210" maxLength={10}
                                        className={inputCls(!!errors.phone)}
                                        {...register('phone', {
                                            pattern: { value: /^[0-9]{10}$/, message: 'Enter 10-digit number' }
                                        })} />
                                    <Err error={errors.phone} />
                                </div>

                                <div>
                                    <label className="lbl">Email</label>
                                    <input type="email" placeholder="you@example.com"
                                        className={inputCls(!!errors.email)}
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                                        })} />
                                    <Err error={errors.email} />
                                </div>

                                <div>
                                    {/* invisible label to align button height */}
                                    <label className="lbl opacity-0 select-none">Submit</label>
                                    <button type="submit" disabled={submitting}
                                        className="btn-green w-full h-12 rounded-xl text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                        {submitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Booking…
                                            </>
                                        ) : (
                                            <>
                                                Get a Price
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Recommended hours hint */}
                            {watchedBhk && BHK_HOURS[watchedBhk] && (
                                <p className="text-center text-xs text-gray-400 mt-5">
                                    For your home size, we recommend{' '}
                                    <span className="text-teal-600 font-bold underline cursor-pointer">
                                        {BHK_HOURS[watchedBhk]}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Card footer */}
                        <div className="bg-gray-50 border-t border-gray-100 px-8 py-4">
                            <p className="text-center text-[11px] text-gray-400 leading-relaxed">
                                By clicking "Get a Price," you agree to our{' '}
                                <span className="underline cursor-pointer text-gray-600 font-semibold">Terms</span>{' '}
                                and{' '}
                                <span className="underline cursor-pointer text-gray-600 font-semibold">Privacy Policy</span>.
                                We'll confirm your booking within the hour.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
                    {[
                        { icon: '✓', label: 'Vetted staff' },
                        { icon: '♻', label: 'Eco-friendly' },
                        { icon: '↺', label: 'Free rescheduling' },
                        { icon: '★', label: 'Satisfaction guaranteed' },
                    ].map(({ icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {icon}
                            </span>
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}