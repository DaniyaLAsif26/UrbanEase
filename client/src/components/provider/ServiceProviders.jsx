import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"

function memberSinceLabel(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

function Stars({ rating }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="13" height="13" viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    )
}

export default function ServiceProviders() {
    const navigate = useNavigate()
    const { bookingId } = useParams()
    const [searchParams] = useSearchParams()
    const area = searchParams.get('area')
    const serviceType = searchParams.get('service')

    const duration = Number(searchParams.get('duration') / 60 || 120)
    const bhk = searchParams.get('bhk') || '2 BHK'

    const [providers, setProviders] = useState([])
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [sortBy, setSortBy] = useState('rating')
    const [btnVisible, setBtnVisible] = useState(false)
    const allSelected = selected.length === providers.length && providers.length > 0

    useEffect(() => {
        if (!bookingId || !area || !serviceType) {
            navigate('/')
            return
        }
    })

    useEffect(() => {
        window.history.pushState(null, '', window.location.href)

        const handlePopState = () => {
            navigate('/', { replace: true })
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    useEffect(() => {
        if (!serviceType || !area) return

        const allProviders = async () => {
            try {
                setLoading(true)

                const params = new URLSearchParams({
                    service: serviceType,
                    area: area
                })

                const data = await fetch(`http://localhost:5000/api/profile/all-providers?${params}`, {
                    method: "GET",
                    credentials: "include"
                })

                const res = await data.json()

                if (res.success) {
                    setProviders(res.allProviders)
                    setLoading(false)
                    setBtnVisible(true)
                }
                else {
                    console.log(res.error)
                    alert(res.error)
                }

            }
            catch (err) {
                console.log(err)
                alert("Error fetching Providers")
            }
            finally {
                setLoading(false)
            }
        }

        allProviders()
    }, [area, serviceType])

    const sorted = [...providers].sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'price') {
            const aPrice = serviceDetails(a.services)?.price ?? 0
            const bPrice = serviceDetails(b.services)?.price ?? 0
            return aPrice - bPrice
        }
        if (sortBy === 'jobs') return b.totalJobs - a.totalJobs
        return 0
    })

    const toggle = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const handleSelectAll = () => setSelected(providers.map(p => p._id))
    const handleDeselect = () => setSelected([])

    const handleSubmit = async () => {
        setSubmitting(true)

        const isAll = selected.length === providers.length

        const payload = {
            providers: isAll ? [] : selected,
            status: 'pending'
        }

        try {
            const res = await fetch(`http://localhost:5000/api/booking/${bookingId}/assign/providers`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                navigate(`/`)
                alert('Providers Notisfied')
            }
            else alert(data.error || 'Something went wrong')
        } catch {
            alert('Failed to confirm booking')
        } finally {
            setSubmitting(false)
        }
    }

    const serviceLabel = serviceType?.replace(/\b\w/g, c => c.toUpperCase())

    const initials = (val) => {
        return val
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "U"
    }

    const serviceDetails = (val) => val?.find(service => service.category === serviceType)

    const estimatedPrice = (p) => {
        const service = serviceDetails(p.services)
        return Math.round((service?.price ?? 0) * duration)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F7F6F3', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:wght@700;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .provider-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 2px solid transparent;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    transition: all 0.22s cubic-bezier(.4,0,.2,1);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .provider-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.11); transform: translateY(-2px); }
                .provider-card.selected { border-color: #16a34a; background: #f0fdf4; box-shadow: 0 4px 24px rgba(22,163,74,0.13); }
                .checkbox {
                    width: 22px; height: 22px; border-radius: 7px;
                    border: 2px solid #d1d5db;
                    background: #fff;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.18s;
                    flex-shrink: 0;
                }
                .checkbox.checked { background: #16a34a; border-color: #16a34a; }
                .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
                .sort-btn { padding: 7px 14px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; color: #374151; }
                .sort-btn.active { background: #111; color: #fff; border-color: #111; }
                .float-btn {
                    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
                    z-index: 50; display: flex; align-items: center; gap: 10px;
                    padding: 0 6px 0 20px;
                    height: 58px;
                    border-radius: 100px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
                    border: none; cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px; font-weight: 700;
                    transition: all 0.25s cubic-bezier(.4,0,.2,1);
                    min-width: 220px;
                    justify-content: space-between;
                }
                .float-btn.all { background: #111; color: #fff; }
                .float-btn.specific { background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; }
                .float-btn:hover:not(:disabled) { transform: translateX(-50%) translateY(-2px); box-shadow: 0 16px 48px rgba(0,0,0,0.22); }
                .float-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .float-badge { background: rgba(255,255,255,0.2); border-radius: 50px; padding: 4px 14px; font-size: 13px; }
                .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 12px; }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .fade-in { animation: fadeIn 0.4s ease forwards; opacity: 0; }
                @keyframes fadeIn { to { opacity: 1; } }
                .slide-up { animation: slideUp 0.35s ease forwards; opacity: 0; transform: translateY(16px); }
                @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
                .avatar { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 17px; flex-shrink: 0; }
                .stat-pill { background: #f3f4f6; border-radius: 8px; padding: 5px 10px; font-size: 12px; font-weight: 600; color: #374151; display: flex; align-items: center; gap: 5px; }
            `}</style>

            {/* ── Header ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 40 }}>
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <button onClick={() => navigate('/')} style={{ background: '#f3f4f6', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900, color: '#111', lineHeight: 1.2 }}>
                                {serviceLabel}
                            </h1>
                            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>
                                📍 {area} · {duration}h ·
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px' }}>

                {/* ── Sort ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, whiteSpace: 'nowrap' }}>Sort by</span>
                    {[['rating', '⭐ Rating'], ['price', '💰 Price'], ['jobs', '🏆 Experience']].map(([val, label]) => (
                        <button key={val} className={`sort-btn ${sortBy === val ? 'active' : ''}`} onClick={() => setSortBy(val)}>{label}</button>
                    ))}
                    {selected.length > 0 && (
                        <button onClick={handleDeselect} style={{ marginLeft: 'auto', whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 20, border: '1.5px solid #fca5a5', background: '#fff5f5', color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                            Clear ({selected.length})
                        </button>
                    )}
                </div>

                {/* ── Provider count ── */}
                {!loading && (
                    <p className="fade-in" style={{ fontSize: 13, color: '#6b7280', marginBottom: 14, fontWeight: 500 }}>
                        {providers.length} providers available in <strong style={{ color: '#111' }}>{area}</strong>
                    </p>
                )}

                {/* ── Skeleton ── */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                    <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 16 }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div className="skeleton" style={{ height: 16, width: '55%' }} />
                                        <div className="skeleton" style={{ height: 12, width: '35%' }} />
                                        <div className="skeleton" style={{ height: 12, width: '70%' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Provider Cards ── */}
                {!loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {sorted.map((p, idx) => {
                            const isSelected = selected.includes(p._id)
                            const price = estimatedPrice(p)
                            const avatarColors = [
                                ['#fef3c7', '#92400e'], ['#dbeafe', '#1e40af'], ['#dcfce7', '#166534'],
                                ['#fce7f3', '#9d174d'], ['#ede9fe', '#5b21b6']
                            ]
                            const [bg, fg] = avatarColors[idx % avatarColors.length]

                            return (
                                <div
                                    key={p._id}
                                    className={`provider-card slide-up ${isSelected ? 'selected' : ''}`}
                                    style={{ animationDelay: `${idx * 0.07}s` }}
                                    onClick={() => toggle(p._id)}
                                >

                                    <div style={{ padding: '18px 18px 16px' }}>
                                        {/* Top row */}
                                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                            {/* Checkbox */}
                                            <div className={`checkbox ${isSelected ? 'checked' : ''}`} style={{ marginTop: 2 }}>
                                                {isSelected && (
                                                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Avatar */}
                                            <div className="avatar" style={{ background: bg, color: fg }}>{initials(p.name)}</div>

                                            {/* Info */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                    <span style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{p.name}</span>
                                                    {p.verified ? (
                                                        <span title="Verified" style={{ color: '#2563eb', display: 'flex' }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        </span>
                                                    )
                                                        :
                                                        (
                                                            <p className="text-[0.75rem] text-red-600">(Not Verified)</p>
                                                        )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                                    <Stars rating={p.rating} />
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{p.rating}</span>
                                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>({p.totalJobs || 0} jobs)</span>
                                                </div>
                                                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>
                                                    Member since {memberSinceLabel(p.createdAt)}
                                                </p>
                                            </div>

                                            {/* Price */}

                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>
                                                    ₹{price}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                                    for {duration}h
                                                </div>
                                                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>₹{serviceDetails(p.services)?.price} / hr</div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div style={{ height: 1, background: '#f3f4f6', margin: '14px 0' }} />

                                        {/* Stats row */}
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            <div className="stat-pill">
                                                <span>✅</span> {p.totalJobs || 0} completion Jobs
                                            </div>
                                            <div className="stat-pill">
                                                <span>🗣</span> {p.languages.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Floating Button ── */}
            {btnVisible && !loading && (
                <button
                    className={`float-btn ${selected.length === 0 || allSelected ? 'all' : 'specific'}`}
                    disabled={submitting}
                    onClick={() => {
                        if (selected.length === 0) {
                            handleSelectAll()
                        } else {
                            handleSubmit()
                        }
                    }}
                >
                    <span>
                        {submitting
                            ? 'Sending...'
                            : selected.length === 0
                                ? '⚡ Notify All Providers'
                                : allSelected
                                    ? '⚡ Notify All Providers'
                                    : `Request ${selected.length} Provider${selected.length > 1 ? 's' : ''}`
                        }
                    </span>
                    <span className="float-badge">
                        {selected.length === 0 ? providers.length : selected.length}
                    </span>
                </button>
            )}
        </div>
    )
}