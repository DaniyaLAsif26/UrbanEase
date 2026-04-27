import { useEffect, useState } from "react"

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000)
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function Avatar({ name }) {
    const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
    const colors = ['bg-orange-100 text-orange-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-rose-100 text-rose-700', 'bg-violet-100 text-violet-700']
    const color = colors[(name?.charCodeAt(0) || 0) % colors.length]
    return <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${color}`}>{initials}</div>
}

function RequestCard({ req, onAccept, onDecline, accepting, declining }) {
    const hrs = req.duration / 60
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <Avatar name={req.userId?.name} />
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{req.userId?.name}</p>
                        <p className="text-xs text-gray-400">{req.userId?.phone}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${req.notifyAll ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {req.notifyAll ? '⚡ Open' : '🎯 Direct'}
                    </span>
                    <span className="text-[10px] text-gray-400">{timeAgo(req.createdAt)}</span>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl px-3 py-2 mb-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Service Type</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{req.serviceType}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                    ['Date', formatDate(req.date)],
                    ['Time', `${req.startTimeSlot} – ${req.endTimeSlot}`],
                    ['Duration', `${hrs}h`],
                    ['Home size', req.serviceDetails?.bhk ? `${req.serviceDetails.bhk} BHK` : '—'],
                ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 rounded-xl px-3 py-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-start gap-2 mb-4 flex-1">
                <span className="text-gray-400 mt-0.5 text-xs">📍</span>
                <p className="text-xs text-gray-500 leading-relaxed">
                    {req.address?.street}
                    {req.address?.landmark ? `, ${req.address.landmark}` : ''}
                    , <span className="font-medium text-gray-700">{req.address?.area}</span>
                </p>
            </div>
            <div className="flex flex-row gap-7">
                <button
                    onClick={() => onAccept(req._id)}
                    disabled={accepting === req._id}
                    className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 mt-auto"
                >
                    {accepting === req._id ? 'Accepting...' : 'Accept Request'}
                </button>
                {req.notifyAll === false &&
                    <button
                        onClick={() => onDecline(req._id)}
                        disabled={declining === req._id}
                        className="w-full bg-red-500 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 mt-auto"
                    >
                        {declining === req._id ? 'Declining...' : 'Decline Request'}
                    </button>
                }
            </div>
        </div>
    )
}

export default function Requests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [accepting, setAccepting] = useState(null)
    const [declining, setDeclining] = useState(null)

    useEffect(() => {
        const allProviders = async () => {
            try {
                const data = await fetch(`${BackEndRoute}/api/booking/get/requested`, {
                    method: "GET",
                    credentials: "include"
                })
                const res = await data.json()
                if (res.success) setRequests(res.requests)
                else alert(res.error)
            } catch (err) {
                console.log(err)
                alert(err.message)
            } finally {
                setLoading(false)
            }
        }
        allProviders()
    }, [])

    const handleAccept = async (bookingId) => {
        setAccepting(bookingId)

        try {
            const res = await fetch(`${BackEndRoute}/api/booking/${bookingId}/accept`, {
                method: 'PATCH',
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success) {
                setRequests(prev => prev.filter(r => r._id !== bookingId))
                alert("Booking accepted")
            }
            else alert(data.error || 'Failed to accept')
        } catch {
            alert('Something went wrong')
        } finally {
            setAccepting(null)
        }
    }

    const handleDecline = async (bookingId) => {
        setDeclining(bookingId)

        try {
            const res = await fetch(`${BackEndRoute}/api/booking/${bookingId}/decline`, {
                method: 'PATCH',
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success) {
                setRequests(prev => prev.filter(r => r._id !== bookingId))
                alert("Booking Declined")
            }
            else alert(data.error || 'Failed to accept')
        } catch {
            alert('Something went wrong')
        } finally {
            setDeclining(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

            <div className="bg-white border-b border-gray-100 px-5 py-4 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Booking Requests</h1>
                        <p className="text-xs text-gray-400">{loading ? 'Loading...' : `${requests.length} pending near you`}</p>
                    </div>
                    {requests.length > 0 && (
                        <span className="bg-gray-900 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                            {requests.length}
                        </span>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-5">
                {loading && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-gray-100 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                                        <div className="h-2.5 bg-gray-100 rounded animate-pulse w-24" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {[1, 2, 3, 4].map(j => <div key={j} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
                                </div>
                                <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && requests.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="font-semibold text-gray-700">No requests yet</p>
                        <p className="text-sm text-gray-400 mt-1">New bookings in your area will appear here</p>
                    </div>
                )}

                {!loading && requests.length > 0 && (
                    <div className="mt-7 gap-y-9 grid grid-cols-1 gap-x-11 md:grid-cols-2">
                        {requests.map(req => (
                            <RequestCard key={req._id} req={req} onAccept={handleAccept} onDecline={handleDecline} accepting={accepting} declining={declining} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}