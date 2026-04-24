import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SLOTS = ['7–9 AM', '9–11 AM', '11–1 PM', '1–3 PM', '3–5 PM', '5–7 PM']

import { useUser } from '../../../context/UserContext'

export default function HouseCleaning() {

    const { userData } = useUser()

    const navigate = useNavigate()
    const [slot, setSlot] = useState('')
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        zip: '',
        bhk: '',
        date: ''
    })

    useEffect(() => {
        if (userData) {
            setForm(prev => ({
                ...prev,
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || '',
            }))
        }
    }, [userData])

    const [errors, setErrors] = useState({})

    const inp = "w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"

    const validate = () => {
        const e = {}
        if (!form.name) e.name = 'Required'
        if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter valid email'
        if (!/^[0-9]{6}$/.test(form.zip)) e.zip = 'Enter 6-digit PIN'
        if (!form.bhk) e.bhk = 'Required'
        if (!form.date) e.date = 'Required'
        if (!slot) e.slot = 'Pick a slot'
        return e
    }

    const onSubmit = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        try {
            const res = await fetch('http://localhost:5000/api/bookings/cleaning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, slot })
            })
            const result = await res.json()
            if (result.success) navigate('/booking-confirmed')
            else alert(result.error || 'Something went wrong')
        } catch (err) {
            alert('Error submitting booking')
        }
    }

    const field = (key, props) => (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{props.label}</label>
            <input {...props} value={form[key]}
                onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })) }}
                className={inp} />
            {errors[key] && <p className="text-red-400 text-xs">{errors[key]}</p>}
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-4xl grid grid-cols-[1fr_420px] rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">

                {/* Left panel */}
                <div className="bg-emerald-50 p-8 flex flex-col justify-end relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="inline-block text-xs font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-4">Professional cleaning</span>
                        <h1 className="text-2xl font-semibold text-gray-800 leading-snug mb-3">Spotless home,<br />every time</h1>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Trusted cleaners in Hyderabad. Book in under 2 minutes.</p>
                        <ul className="space-y-2">
                            {['Vetted & background-checked staff', 'Eco-friendly products', 'Flexible rescheduling', 'Satisfaction guaranteed'].map(p => (
                                <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />{p}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* house illustration opacity */}
                    <div className="absolute bottom-0 right-0 opacity-10 text-emerald-600">
                        <svg width="220" height="200" viewBox="0 0 260 240" fill="currentColor">
                            <path d="M130 10L10 100V230H250V100L130 10Z" />
                        </svg>
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="p-8 flex flex-col justify-center">
                    <h2 className="text-base font-semibold text-gray-800 mb-0.5">Book your cleaning</h2>
                    <p className="text-xs text-gray-400 mb-5">We'll confirm your slot within the hour.</p>

                    <div className="grid grid-cols-2 gap-3">
                        {field('name', { label: 'Full name', type: 'text', placeholder: 'Riya Sharma' })}
                        {field('phone', { label: 'Phone', type: 'tel', placeholder: '9876543210', maxLength: 10 })}

                        <div className="col-span-2">
                            {field('email', { label: 'Email', type: 'email', placeholder: 'riya@example.com' })}
                        </div>

                        <div className="col-span-2 h-px bg-gray-100" />

                        {field('zip', { label: 'ZIP / Area PIN', type: 'text', placeholder: '500034', maxLength: 6 })}

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">House size</label>
                            <select value={form.bhk} onChange={e => { setForm(p => ({ ...p, bhk: e.target.value })); setErrors(p => ({ ...p, bhk: '' })) }}
                                className={`${inp} text-gray-600`}>
                                <option value="">Select BHK</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n}>{n} BHK</option>)}
                            </select>
                            {errors.bhk && <p className="text-red-400 text-xs">{errors.bhk}</p>}
                        </div>

                        {field('date', { label: 'Date', type: 'date', min: new Date().toISOString().split('T')[0] })}

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Time slot</label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {SLOTS.map(s => (
                                    <button key={s} type="button" onClick={() => { setSlot(s); setErrors(p => ({ ...p, slot: '' })) }}
                                        className={`py-1.5 text-xs rounded-lg border transition ${slot === s
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                                            : 'border-gray-200 text-gray-500 hover:border-emerald-400'
                                            }`}>{s}</button>
                                ))}
                            </div>
                            {errors.slot && <p className="text-red-400 text-xs">{errors.slot}</p>}
                        </div>

                        <button onClick={onSubmit}
                            className="col-span-2 mt-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition active:scale-[0.99]">
                            Confirm booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}