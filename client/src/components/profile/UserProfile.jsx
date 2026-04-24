// UserProfile

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { useLogin } from "../../context/LoginContext"

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export default function UserProfile() {
    const { userData, clearUserData, updateUserData } = useUser()
    const { isUserLoggedIn, isUserLoaded, verifyUserLogin } = useLogin()
    const navigate = useNavigate()

    const [bookings, setBookings] = useState([])
    const [bookingsLoaded, setBookingsLoaded] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState("")

    const initials = userData?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    useEffect(() => {
        if (isUserLoaded) {
            if (!isUserLoggedIn) {
                navigate("/login/user")
            }
        }
    }, [isUserLoggedIn])

    useEffect(() => {
        if (isUserLoaded) {
            setEditForm({
                name: userData.name || "",
                phone: userData.phone || "",
                email: userData.email || "",
                address: {
                    area: userData.address.area || '',
                    street: userData.address.street || '',
                    landmark: userData.address.landmark || '',
                },
                pincode: userData.pincode || "",
            })
        }
    }, [userData])

    // useEffect(() => {
    //     const fetchBookings = async () => {
    //         try {
    //             const res = await fetch(`${BackEndRoute}/api/bookings/user`, {
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
        await fetch(`${BackEndRoute}/api/logout/user`, {
            method: "POST",
            credentials: "include",
        })
        clearUserData()
        verifyUserLogin()
        navigate("/")
    }

    const handleEditSave = async () => {
        setSaving(true)
        setSaveError("")
        try {
            const res = await fetch(`${BackEndRoute}/api/profile/user`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            })
            const data = await res.json()
            if (data.success) {
                updateUserData(editForm)
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

    const statusMeta = {
        completed: { label: "Completed", color: "#3B6D11", bg: "#EAF3DE" },
        upcoming: { label: "Upcoming", color: "#3C3489", bg: "#EEEDFE" },
        "in-progress": { label: "In Progress", color: "#633806", bg: "#FAEEDA" },
        cancelled: { label: "Cancelled", color: "#A32D2D", bg: "#FCEBEB" },
    }

    const serviceIcons = {
        cleaning: "🧹",
        plumbing: "🔧",
        electrical: "⚡",
        painting: "🎨",
        carpentry: "🪚",
        appliance: "🔌",
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Playfair+Display:wght@400;500&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .pf-page {
                    min-height: 100vh;
                    background: white;
                    font-family: 'DM Sans', sans-serif;
                    padding: 2rem 1rem 4rem;
                    // border : 2px solid black;
                }

                .pf-container {
                    max-width: 700px;
                    margin: 0 auto;
                }

                /* Header */
                .pf-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .pf-header-left { display: flex; align-items: flex-end; gap: 1rem; }

                .pf-avatar {
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    background: #534AB7;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 24px;
                    font-weight: 400;
                    color: #EEEDFE;
                    flex-shrink: 0;
                    position: relative;
                    letter-spacing: 1px;
                }

                .pf-avatar-dot {
                    width: 11px;
                    height: 11px;
                    background: #639922;
                    border-radius: 50%;
                    border: 2px solid #f9f9f9;
                    position: absolute;
                    bottom: 3px;
                    right: 3px;
                }

                .pf-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 400;
                    color: #1a1a1a;
                    margin-bottom: 3px;
                }

                .pf-meta {
                    font-size: 12px;
                    color: #888;
                    display: flex;
                    gap: 10px;
                }

                .pf-header-actions { display: flex; gap: 8px; flex-wrap: wrap; }

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
                .btn-outline:hover { background: rgba(0,0,0,0.05); }

                .btn-purple {
                    background: #534AB7;
                    color: #EEEDFE;
                }
                .btn-purple:hover { background: #3C3489; }

                .btn-danger {
                    background: transparent;
                    border: 1px solid rgba(163,45,45,0.3);
                    color: #A32D2D;
                }
                .btn-danger:hover { background: #FCEBEB; }

                /* Section label */
                .sec-label {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    // color: #777;
                    margin-bottom: 10px;
                }

                /* Info grid */
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
                    color: #888;
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

                .address-card {
                    background: #f0f0f0;
                    border-radius: 10px;
                    padding: 13px 15px;
                    border: 1px solid rgba(0,0,0,0.07);
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    margin-bottom: 1.75rem;
                }

                .addr-icon-wrap {
                    width: 32px;
                    height: 32px;
                    background: #EEEDFE;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .divider {
                    border: none;
                    border-top: 1px solid rgba(0,0,0,0.08);
                    margin: 1.75rem 0;
                }

                /* Bookings */
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
                .booking-card:hover { border-color: rgba(83,74,183,0.3); }

                .booking-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                    background: #f5f5f5;
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

                .booking-provider {
                    font-size: 11px;
                    color: #aaa;
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

                .empty-bookings {
                    background: #f0f0f0;
                    border: 1px dashed rgba(0,0,0,0.12);
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    color: #bbb;
                    font-size: 13px;
                }

                /* Quick actions */
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
                .qa-card:hover { border-color: rgba(83,74,183,0.3); background: #EEEDFE15; }

                .qa-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 8px;
                    font-size: 14px;
                }

                .qa-label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #444;
                }

                /* Edit Modal */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.35);
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
                    color: #777; 
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
                    background: #fafafa;
                    outline: none;
                    transition: border-color 0.15s;
                }
                .field-input:focus { border-color: #534AB7; background: #fff; }

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

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pf-container > * {
                    animation: fadeIn 0.3s ease both;
                }
            `}</style>

            <div className="pf-page">
                <div className="pf-container">

                    {/* Header */}
                    <div className="pf-header">
                        <div className="pf-header-left">
                            <div className="pf-avatar">
                                {initials}
                                <div className="pf-avatar-dot" />
                            </div>
                            <div>
                                <div className="pf-name">{userData?.name || "User"}</div>
                                <div className="pf-meta">
                                    <span>{userData?.email}</span>
                                    {userData?.phone && <span>· {userData.phone}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="pf-header-actions">
                            <button className="btn btn-outline" onClick={() => setEditOpen(true)}>Edit profile</button>
                            <button className="btn btn-purple" onClick={() => navigate("/services")}>Book service</button>
                            <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="sec-label">Personal info</div>
                    <div className="info-grid">
                        <div className="info-card">
                            <div className="info-card-label">Full name</div>
                            <div className={`info-card-value ${!userData?.name ? "empty" : ""}`}>
                                {userData?.name || "Not set"}
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-card-label">Phone</div>
                            <div className={`info-card-value ${!userData?.phone ? "empty" : ""}`}>
                                {userData?.phone || "Not set"}
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-card-label">Email</div>
                            <div className={`info-card-value ${!userData?.email ? "empty" : ""}`}>
                                {userData?.email || "Not set"}
                            </div>
                        </div>

                    </div>

                    <div className="address-card">
                        <div className="addr-icon-wrap">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" />
                            </svg>
                        </div>
                        <div>
                            <div className="info-card-label" style={{ marginBottom: 4 }}>Saved address</div>
                            {userData?.address && (
                                <>
                                    <div className={`info-card-value ${!userData?.address ? "empty" : ""}`} style={{ fontSize: 13, lineHeight: 1.5 }}>
                                        {userData?.address.area || "No address saved"}
                                    </div>
                                    <div className={`info-card-value ${!userData?.address ? "empty" : ""}`} style={{ fontSize: 13, lineHeight: 1.5 }}>
                                        {userData?.address.street || "No street saved"}
                                    </div>
                                    <div className={`info-card-value ${!userData?.address ? "empty" : ""}`} style={{ fontSize: 13, lineHeight: 1.5 }}>
                                        {userData?.address.landmark || "No landmark saved"}
                                    </div>
                                </>
                            )}

                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Bookings */}
                    <div className="bookings-header">
                        <div className="sec-label" style={{ marginBottom: 0 }}>Recent bookings</div>
                        <button className="view-all" onClick={() => navigate("/bookings")}>View all →</button>
                    </div>

                    <div className="booking-list">
                        {!bookingsLoaded ? (
                            <div className="empty-bookings">Loading bookings...</div>
                        ) : bookings.length === 0 ? (
                            <div className="empty-bookings">No bookings yet — book your first service!</div>
                        ) : (
                            bookings.slice(0, 3).map((b, i) => {
                                const status = statusMeta[b.status] || statusMeta.upcoming
                                const icon = serviceIcons[b.serviceType] || "🛠️"
                                return (
                                    <div className="booking-card" key={i} onClick={() => navigate(`/bookings/${b._id}`)}>
                                        <div className="booking-icon">{icon}</div>
                                        <div className="booking-info">
                                            <div className="booking-name">{b.serviceName}</div>
                                            <div className="booking-provider">{b.providerName || "Provider"}</div>
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

                    <hr className="divider" />

                    {/* Quick Actions */}
                    <div className="sec-label">Quick actions</div>
                    <div className="quick-grid">
                        <div className="qa-card" onClick={() => navigate("/services")}>
                            <div className="qa-icon" style={{ background: "#EEEDFE" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </div>
                            <div className="qa-label">New booking</div>
                        </div>
                        <div className="qa-card" onClick={() => navigate("/bookings")}>
                            <div className="qa-icon" style={{ background: "#EAF3DE" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div className="qa-label">My bookings</div>
                        </div>
                        <div className="qa-card" onClick={() => setEditOpen(true)}>
                            <div className="qa-icon" style={{ background: "#FAECE7" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#993C1D" strokeWidth="2" strokeLinecap="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </div>
                            <div className="qa-label">Edit profile</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false) }}>
                    <div className="modal-box">
                        <div className="modal-title">Edit profile</div>

                        {["name", "phone", "email", "area", "street" , "landmark"].map((field) => (
                            <div className="field-group" key={field}>
                                <label className="field-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <input
                                    className="field-input"
                                    type={field === "email" ? "email" : "text"}
                                    value={['area', 'street', 'landmark'].includes(field) ? editForm.address?.[field] || "" : editForm[field] || ""}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                                    placeholder={`Enter your ${field}`}
                                />
                            </div>
                        ))}

                        {saveError && <div className="save-error">{saveError}</div>}

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={() => setEditOpen(false)}>Cancel</button>
                            <button className="btn btn-purple" onClick={handleEditSave} disabled={saving}>
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}