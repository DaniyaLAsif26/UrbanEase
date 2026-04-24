// ProviderProfile

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { useLogin } from "../../context/LoginContext"

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

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

const serviceIcons = {
    'Plumbing': '🔧',
    'Electrical work': '⚡',
    'House cleaning': '🧹',
    'Carpentry & furniture repair': '🪚',
    'Painting & wall finishing': '🎨',
    'Appliance repair': '🔌',
    'Tutoring & coaching': '📚',
    'Personal fitness training': '🏋️',
    'Pest control': '🐛',
    'Gardening & landscaping': '🌿',
    'Laundry & ironing': '👕',
    'Beauty & grooming': '💇',
}

export default function ProviderProfile() {
    const { providerData, clearProviderData, updateProviderData } = useUser()
    const { isProviderLoggedIn, verifyProviderLogin , isProviderLoaded } = useLogin()
    const navigate = useNavigate()

    const [bookings, setBookings] = useState([])
    const [bookingsLoaded, setBookingsLoaded] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState("")
    const [activeTab, setActiveTab] = useState("overview")

    // Services edit state
    const [servicesEditOpen, setServicesEditOpen] = useState(false)
    const [editedServices, setEditedServices] = useState({})
    const [servicesSaving, setServicesSaving] = useState(false)
    const [servicesSaveError, setServicesSaveError] = useState("")

    const initials = providerData?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "P"

    useEffect(() => {
        if (isProviderLoaded) {
            if (!isProviderLoggedIn) {
                navigate("/login/provider")
            }
        }
    }, [isProviderLoggedIn])

    useEffect(() => {
        if (isProviderLoggedIn) {

            if (providerData) {
                setEditForm({
                    name: providerData.name || "",
                    phone: providerData.phone || "",
                    email: providerData.email || "",
                    area: providerData.area || "",
                    bio: providerData.bio || "",
                })
            }
        }
    }, [providerData])

    // useEffect(() => {
    //     const fetchBookings = async () => {
    //         try {
    //             const res = await fetch(`${BackEndRoute}/api/bookings/provider`, {
    //                 credentials: "include",
    //             })
    //             const data = await res.json()
    //             if (data.success) setBookings(data.bookings || [])
    //         } catch (err) {
    //             console.log(err)
    //         } finally {
    //             setBookingsLoaded(true)
    //         }
    //     }
    //     fetchBookings()
    // }, [])

    const handleLogout = async () => {
        await fetch(`${BackEndRoute}/api/logout/provider`, {
            method: "POST",
            credentials: "include",
        })
        clearProviderData()
        verifyProviderLogin()
        navigate("/")
    }

    const handleEditSave = async () => {
        setSaving(true)
        setSaveError("")
        try {
            const res = await fetch(`${BackEndRoute}/api/profile/provider`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            })
            const data = await res.json()
            if (data.success) {
                updateProviderData(editForm)
                setEditOpen(false)
            } else {
                setSaveError(data.error || "Failed to save")
            }
        } catch (err) {
            setSaveError("Network error")
        } finally {
            setSaving(false)
        }
    }

    // ── Services edit handlers ──
    const openServicesEdit = () => {
        // Pre-populate from current provider services
        const current = {}
        if (providerData?.services) {
            providerData.services.forEach(s => {
                current[s.category] = String(s.price)
            })
        }
        setEditedServices(current)
        setServicesSaveError("")
        setServicesEditOpen(true)
    }

    const handleServiceToggle = (name) => {
        setEditedServices(prev => {
            if (name in prev) {
                const updated = { ...prev }
                delete updated[name]
                return updated
            }
            return { ...prev, [name]: '' }
        })
    }

    const handleServicePriceChange = (name, price) => {
        setEditedServices(prev => ({ ...prev, [name]: price }))
    }

    const handleServicesSave = async () => {
        setServicesSaveError("")

        const services = Object.entries(editedServices).map(([category, price]) => ({
            category, price: Number(price)
        }))

        if (services.length === 0) {
            setServicesSaveError("Please select at least one service.")
            return
        }
        if (services.some(s => !s.price || s.price <= 0)) {
            setServicesSaveError("Enter a valid price for each selected service.")
            return
        }

        setServicesSaving(true)
        try {
            const res = await fetch(`${BackEndRoute}/api/profile/provider/services`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ services }),
            })
            const data = await res.json()
            if (data.success) {
                updateProviderData({ services })
                setServicesEditOpen(false)
            } else {
                setServicesSaveError(data.error || "Failed to save services")
            }
        } catch (err) {
            setServicesSaveError("Network error")
        } finally {
            setServicesSaving(false)
        }
    }

    const statusMeta = {
        completed: { label: "Completed", color: "#3B6D11", bg: "#EAF3DE" },
        upcoming: { label: "Upcoming", color: "#3C3489", bg: "#EEEDFE" },
        "in-progress": { label: "In Progress", color: "#633806", bg: "#FAEEDA" },
        cancelled: { label: "Cancelled", color: "#A32D2D", bg: "#FCEBEB" },
    }

    const totalEarnings = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + (b.price || 0), 0)

    const completedCount = bookings.filter(b => b.status === "completed").length
    const upcomingCount = bookings.filter(b => b.status === "upcoming").length

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Playfair+Display:wght@400;500&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .pp-page {
                    min-height: 100vh;
                    background: #e8e8e8;
                    font-family: 'DM Sans', sans-serif;
                    padding: 5.5rem 1rem 4rem;
                }

                .pp-container {
                    max-width: 720px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .pp-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.75rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .pp-header-left { display: flex; align-items: center; gap: 1rem; }

                .pp-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: #1a1a1a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 26px;
                    font-weight: 400;
                    color: #f0f0f0;
                    flex-shrink: 0;
                    position: relative;
                    letter-spacing: 1px;
                }

                .pp-avatar-dot {
                    width: 12px;
                    height: 12px;
                    background: #639922;
                    border-radius: 50%;
                    border: 2px solid #e8e8e8;
                    position: absolute;
                    bottom: 3px;
                    right: 3px;
                }

                .pp-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 400;
                    color: #1a1a1a;
                    margin-bottom: 3px;
                }

                .pp-meta {
                    font-size: 12px;
                    color: #666;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 4px;
                }

                .pp-area-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    font-weight: 500;
                    background: #1a1a1a;
                    color: #f0f0f0;
                    padding: 3px 10px;
                    border-radius: 20px;
                }

                .pp-status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    font-weight: 500;
                    padding: 3px 10px;
                    border-radius: 20px;
                    margin-left: 6px;
                }

                .pp-status-badge.approved { background: #EAF3DE; color: #3B6D11; }
                .pp-status-badge.pending { background: #FAEEDA; color: #633806; }

                .pp-header-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-start; }

                .btn {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 8px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.15s;
                    border: none;
                    outline: none;
                }

                .btn-outline {
                    background: transparent;
                    border: 1px solid rgba(0,0,0,0.18);
                    color: #1a1a1a;
                }
                .btn-outline:hover { background: rgba(0,0,0,0.06); }

                .btn-dark {
                    background: #1a1a1a;
                    color: #f0f0f0;
                }
                .btn-dark:hover { background: #333; }

                .btn-danger {
                    background: transparent;
                    border: 1px solid rgba(163,45,45,0.3);
                    color: #A32D2D;
                }
                .btn-danger:hover { background: #FCEBEB; }

                /* ── Stats row ── */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    margin-bottom: 1.5rem;
                }

                .stat-card {
                    background: #f0f0f0;
                    border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 12px;
                    padding: 14px 16px;
                }

                .stat-label {
                    font-size: 10px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #666;
                    margin-bottom: 6px;
                }

                .stat-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 400;
                    color: #1a1a1a;
                }

                .stat-sub {
                    font-size: 11px;
                    color: #888;
                    margin-top: 2px;
                }

                /* ── Tabs ── */
                .tabs {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 1.25rem;
                    background: #f0f0f0;
                    border-radius: 10px;
                    padding: 4px;
                    border: 1px solid rgba(0,0,0,0.07);
                }

                .tab {
                    flex: 1;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 8px;
                    border-radius: 7px;
                    cursor: pointer;
                    transition: all 0.15s;
                    color: #777;
                    border: none;
                    background: transparent;
                    font-family: 'DM Sans', sans-serif;
                }

                .tab.active {
                    background: #1a1a1a;
                    color: #f0f0f0;
                }

                .tab:not(.active):hover { background: rgba(0,0,0,0.05); color: #333; }

                /* ── Section label ── */
                .sec-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #666;
                    margin-bottom: 10px;
                }

                /* ── Info cards ── */
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .info-card {
                    background: #f0f0f0;
                    border-radius: 10px;
                    padding: 13px 15px;
                    border: 1px solid rgba(0,0,0,0.07);
                }

                .info-card-label {
                    font-size: 10px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    color: #666;
                    margin-bottom: 5px;
                }

                .info-card-value {
                    font-size: 14px;
                    color: #1a1a1a;
                    font-weight: 400;
                }

                .info-card-value.empty {
                    color: #aaa;
                    font-style: italic;
                    font-size: 13px;
                }

                /* ── Bio card ── */
                .bio-card {
                    background: #f0f0f0;
                    border-radius: 10px;
                    padding: 14px 16px;
                    border: 1px solid rgba(0,0,0,0.07);
                    margin-bottom: 1.5rem;
                    font-size: 13.5px;
                    color: #333;
                    line-height: 1.6;
                }

                /* ── Services list ── */
                .services-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                    margin-bottom: 1.5rem;
                }

                .service-card {
                    background: #f0f0f0;
                    border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 10px;
                    padding: 11px 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .service-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    background: #e0e0e0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 15px;
                    flex-shrink: 0;
                }

                .service-name {
                    flex: 1;
                    font-size: 13px;
                    font-weight: 500;
                    color: #1a1a1a;
                }

                .service-price {
                    font-size: 13px;
                    font-weight: 500;
                    color: #1a1a1a;
                    background: #e0e0e0;
                    padding: 3px 10px;
                    border-radius: 20px;
                }

                /* ── Services tab header ── */
                .services-tab-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                /* ── Divider ── */
                .divider {
                    border: none;
                    border-top: 1px solid rgba(0,0,0,0.08);
                    margin: 1.5rem 0;
                }

                /* ── Bookings ── */
                .bookings-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .view-all {
                    font-size: 12px;
                    font-weight: 500;
                    color: #534AB7;
                    cursor: pointer;
                    background: none;
                    border: none;
                    font-family: 'DM Sans', sans-serif;
                    padding: 0;
                }
                .view-all:hover { text-decoration: underline; }

                .booking-list { display: flex; flex-direction: column; gap: 7px; }

                .booking-card {
                    background: #f0f0f0;
                    border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 12px;
                    padding: 13px 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: border-color 0.15s;
                    cursor: pointer;
                }
                .booking-card:hover { border-color: rgba(0,0,0,0.2); }

                .booking-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                    background: #e0e0e0;
                }

                .booking-info { flex: 1; min-width: 0; }

                .booking-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: #1a1a1a;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 2px;
                }

                .booking-customer {
                    font-size: 11px;
                    color: #777;
                }

                .booking-right { text-align: right; flex-shrink: 0; }

                .booking-badge {
                    font-size: 10px;
                    font-weight: 500;
                    padding: 3px 9px;
                    border-radius: 20px;
                    display: inline-block;
                    margin-bottom: 3px;
                }

                .booking-date {
                    font-size: 10px;
                    color: #888;
                }

                .empty-state {
                    background: #f0f0f0;
                    border: 1px dashed rgba(0,0,0,0.12);
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    color: #888;
                    font-size: 13px;
                }

                /* ── Quick actions ── */
                .quick-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                }

                .qa-card {
                    background: #f0f0f0;
                    border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 10px;
                    padding: 14px 10px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.15s;
                    font-family: 'DM Sans', sans-serif;
                }
                .qa-card:hover { border-color: rgba(0,0,0,0.2); background: #e8e8e8; }

                .qa-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 8px;
                    font-size: 14px;
                    background: #e0e0e0;
                }

                .qa-label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #333;
                }

                /* ── Edit Modal (shared) ── */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    padding: 1rem;
                }

                .modal-box {
                    background: #f0f0f0;
                    border-radius: 16px;
                    padding: 1.75rem;
                    width: 100%;
                    max-width: 460px;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 19px;
                    font-weight: 400;
                    color: #1a1a1a;
                    margin-bottom: 1.25rem;
                }

                .field-group { margin-bottom: 1rem; }

                .field-label {
                    font-size: 11px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    color: #555;
                    margin-bottom: 5px;
                    display: block;
                }

                .field-input {
                    width: 100%;
                    padding: 10px 13px;
                    border-radius: 8px;
                    border: 1px solid rgba(0,0,0,0.14);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    color: #1a1a1a;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.15s;
                }
                .field-input:focus { border-color: #1a1a1a; }

                .field-select {
                    width: 100%;
                    padding: 10px 13px;
                    border-radius: 8px;
                    border: 1px solid rgba(0,0,0,0.14);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    color: #1a1a1a;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.15s;
                    appearance: none;
                }
                .field-select:focus { border-color: #1a1a1a; }

                .modal-actions {
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                    margin-top: 1.25rem;
                }

                .save-error {
                    font-size: 12px;
                    color: #A32D2D;
                    margin-top: 8px;
                    text-align: right;
                }

                /* ── Services modal ── */
                .services-modal-box {
                    background: #f0f0f0;
                    border-radius: 16px;
                    padding: 1.75rem;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .services-checklist {
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 4px;
                }

                .service-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 14px;
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    transition: background 0.1s;
                }
                .service-row:last-child { border-bottom: none; }
                .service-row:hover { background: #fafafa; }
                .service-row.checked { background: #f5f5ff; }

                .service-row-icon {
                    font-size: 16px;
                    flex-shrink: 0;
                    width: 22px;
                    text-align: center;
                }

                .service-row-name {
                    flex: 1;
                    font-size: 13px;
                    color: #1a1a1a;
                    cursor: pointer;
                    user-select: none;
                }

                .service-row-price {
                    width: 90px;
                    padding: 6px 10px;
                    border-radius: 7px;
                    border: 1px solid rgba(0,0,0,0.12);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    color: #1a1a1a;
                    background: #f5f5f5;
                    outline: none;
                    transition: border-color 0.15s, opacity 0.15s;
                    text-align: right;
                }
                .service-row-price:focus { border-color: #1a1a1a; }
                .service-row-price:disabled { opacity: 0.3; cursor: not-allowed; }

                .service-row input[type="checkbox"] {
                    accent-color: #1a1a1a;
                    width: 15px;
                    height: 15px;
                    cursor: pointer;
                    flex-shrink: 0;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pp-container > * {
                    animation: fadeIn 0.3s ease both;
                }
            `}</style>

            <div className="pp-page">
                <div className="pp-container">

                    {/* ── Header ── */}
                    <div className="pp-header">
                        <div className="pp-header-left">
                            <div className="pp-avatar">
                                {initials}
                                <div className="pp-avatar-dot" />
                            </div>
                            <div>
                                <div className="pp-name">{providerData?.name || "Provider"}</div>
                                <div className="pp-meta">
                                    <span>{providerData?.email}</span>
                                    {providerData?.phone && <span>· {providerData.phone}</span>}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                    {providerData?.area && (
                                        <span className="pp-area-badge">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                <circle cx="12" cy="9" r="2.5" />
                                            </svg>
                                            {providerData.area}
                                        </span>
                                    )}
                                    <span className={`pp-status-badge ${providerData?.isApproved ? "approved" : "pending"}`}>
                                        {providerData?.isApproved ? "✓ Approved" : "⏳ Pending approval"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pp-header-actions">
                            <button className="btn btn-outline" onClick={() => setEditOpen(true)}>Edit profile</button>
                            <button className="btn btn-dark" onClick={() => navigate("/bookings/provider")}>View bookings</button>
                            <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>

                    {/* ── Stats ── */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-label">Total earned</div>
                            <div className="stat-value">₹{totalEarnings.toLocaleString("en-IN")}</div>
                            <div className="stat-sub">from completed jobs</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Completed</div>
                            <div className="stat-value">{completedCount}</div>
                            <div className="stat-sub">bookings done</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Upcoming</div>
                            <div className="stat-value">{upcomingCount}</div>
                            <div className="stat-sub">scheduled jobs</div>
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="tabs">
                        {["overview", "services", "bookings"].map(tab => (
                            <button
                                key={tab}
                                className={`tab ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* ── Overview Tab ── */}
                    {activeTab === "overview" && (
                        <>
                            <div className="sec-label">Personal info</div>
                            <div className="info-grid" style={{ marginBottom: "1rem" }}>
                                <div className="info-card">
                                    <div className="info-card-label">Full name</div>
                                    <div className={`info-card-value ${!providerData?.name ? "empty" : ""}`}>
                                        {providerData?.name || "Not set"}
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-card-label">Phone</div>
                                    <div className={`info-card-value ${!providerData?.phone ? "empty" : ""}`}>
                                        {providerData?.phone || "Not set"}
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-card-label">Email</div>
                                    <div className={`info-card-value ${!providerData?.email ? "empty" : ""}`}>
                                        {providerData?.email || "Not set"}
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-card-label">Service area</div>
                                    <div className={`info-card-value ${!providerData?.area ? "empty" : ""}`}>
                                        {providerData?.area || "Not set"}
                                    </div>
                                </div>
                            </div>

                            <div className="sec-label">Bio</div>
                            <div className="bio-card">
                                {providerData?.bio || <span style={{ color: "#aaa", fontStyle: "italic" }}>No bio added yet.</span>}
                            </div>

                            <hr className="divider" />

                            <div className="sec-label">Quick actions</div>
                            <div className="quick-grid">
                                <div className="qa-card" onClick={() => setActiveTab("bookings")}>
                                    <div className="qa-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </div>
                                    <div className="qa-label">Bookings</div>
                                </div>
                                <div className="qa-card" onClick={() => setActiveTab("services")}>
                                    <div className="qa-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                        </svg>
                                    </div>
                                    <div className="qa-label">Services</div>
                                </div>
                                <div className="qa-card" onClick={() => setEditOpen(true)}>
                                    <div className="qa-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </div>
                                    <div className="qa-label">Edit profile</div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Services Tab ── */}
                    {activeTab === "services" && (
                        <>
                            <div className="services-tab-header">
                                <div className="sec-label" style={{ marginBottom: 0 }}>Your services</div>
                                <button className="btn btn-outline" style={{ fontSize: 12, padding: "6px 14px" }} onClick={openServicesEdit}>
                                    Edit services
                                </button>
                            </div>
                            <div className="services-grid">
                                {!providerData?.services || providerData.services.length === 0 ? (
                                    <div className="empty-state">
                                        No services listed yet.{" "}
                                        <span
                                            style={{ color: "#534AB7", cursor: "pointer", textDecoration: "underline" }}
                                            onClick={openServicesEdit}
                                        >
                                            Add some →
                                        </span>
                                    </div>
                                ) : (
                                    providerData.services.map((s, i) => (
                                        <div className="service-card" key={i}>
                                            <div className="service-icon">
                                                {serviceIcons[s.category] || "🛠️"}
                                            </div>
                                            <div className="service-name">{s.category}</div>
                                            <div className="service-price">₹{s.price}/visit</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {/* ── Bookings Tab ── */}
                    {activeTab === "bookings" && (
                        <>
                            <div className="bookings-header">
                                <div className="sec-label" style={{ marginBottom: 0 }}>Recent bookings</div>
                                <button className="view-all" onClick={() => navigate("/bookings/provider")}>View all →</button>
                            </div>
                            <div className="booking-list">
                                {!bookingsLoaded ? (
                                    <div className="empty-state">Loading bookings...</div>
                                ) : bookings.length === 0 ? (
                                    <div className="empty-state">No bookings yet.</div>
                                ) : (
                                    bookings.slice(0, 5).map((b, i) => {
                                        const status = statusMeta[b.status] || statusMeta.upcoming
                                        const icon = serviceIcons[b.serviceType] || "🛠️"
                                        return (
                                            <div className="booking-card" key={i} onClick={() => navigate(`/bookings/${b._id}`)}>
                                                <div className="booking-icon">{icon}</div>
                                                <div className="booking-info">
                                                    <div className="booking-name">{b.serviceName}</div>
                                                    <div className="booking-customer">{b.customerName || "Customer"}</div>
                                                </div>
                                                <div className="booking-right">
                                                    <div className="booking-badge" style={{ background: status.bg, color: status.color }}>
                                                        {status.label}
                                                    </div>
                                                    <div className="booking-date">
                                                        {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* ── Edit Profile Modal ── */}
            {editOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false) }}>
                    <div className="modal-box">
                        <div className="modal-title">Edit profile</div>

                        {["name", "phone", "email", "bio"].map((field) => (
                            <div className="field-group" key={field}>
                                <label className="field-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                {field === "bio" ? (
                                    <textarea
                                        className="field-input"
                                        rows={3}
                                        style={{ resize: "none" }}
                                        value={editForm[field] || ""}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                                        placeholder={`Enter your ${field}`}
                                    />
                                ) : (
                                    <input
                                        className="field-input"
                                        type={field === "email" ? "email" : "text"}
                                        value={editForm[field] || ""}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                                        placeholder={`Enter your ${field}`}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="field-group">
                            <label className="field-label">Service area</label>
                            <select
                                className="field-select"
                                value={editForm.area || ""}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, area: e.target.value }))}
                            >
                                <option value="">Select your area</option>
                                {AREAS.map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>

                        {saveError && <div className="save-error">{saveError}</div>}

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={() => setEditOpen(false)}>Cancel</button>
                            <button className="btn btn-dark" onClick={handleEditSave} disabled={saving}>
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Services Modal ── */}
            {servicesEditOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setServicesEditOpen(false) }}>
                    <div className="services-modal-box">
                        <div className="modal-title">Edit services & pricing</div>
                        <p style={{ fontSize: 12, color: "#777", marginBottom: "1rem", marginTop: "-0.75rem" }}>
                            Check a service to offer it, then set your price per visit (₹).
                        </p>

                        <div className="services-checklist">
                            {SERVICES.map(s => {
                                const isChecked = s in editedServices
                                return (
                                    <div className={`service-row ${isChecked ? "checked" : ""}`} key={s}>
                                        <input
                                            type="checkbox"
                                            id={`edit-svc-${s}`}
                                            checked={isChecked}
                                            onChange={() => handleServiceToggle(s)}
                                        />
                                        <span className="service-row-icon">{serviceIcons[s] || "🛠️"}</span>
                                        <label htmlFor={`edit-svc-${s}`} className="service-row-name">{s}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="₹ price"
                                            value={editedServices[s] || ""}
                                            onChange={e => handleServicePriceChange(s, e.target.value)}
                                            disabled={!isChecked}
                                            className="service-row-price"
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        {servicesSaveError && <div className="save-error">{servicesSaveError}</div>}

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={() => setServicesEditOpen(false)}>Cancel</button>
                            <button className="btn btn-dark" onClick={handleServicesSave} disabled={servicesSaving}>
                                {servicesSaving ? "Saving..." : "Save services"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}