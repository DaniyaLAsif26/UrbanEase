import { useEffect, useState } from "react"
import { useParams , useNavigate } from "react-router-dom"
import { useLogin } from "../../context/LoginContext"
import { useUser } from "../../context/UserContext"

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export default function AllProviderBookings({ isAdmin = false }) {

    const navigate = useNavigate()

    const [providerBookings, setProviderBookings] = useState(null)
    const [bookingsLoaded, setBookingsLoaded] = useState(false)

    const { providerData } = useUser()
    const { isProviderLoggedIn } = useLogin()
    const { id } = useParams()

    const fetchBookings = async () => {
        const route = isAdmin
            ? `${BackEndRoute}/api/admin/provider/bookings/${id}`
            : `${BackEndRoute}/api/booking/all/provider`
        try {
            const res = await fetch(route, {
                method: "GET",
                credentials: "include",
            })
            const data = await res.json()
            if (data.success) {
                setProviderBookings(Array.isArray(data.bookings) ? data.bookings : [])
            }
        } catch (err) {
            console.log(err)
            setProviderBookings([])
        } finally {
            setBookingsLoaded(true)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [id, isAdmin])

    const statusMeta = {
        completed: { label: "Completed", color: "#3B6D11", bg: "#EAF3DE" },
        accepted: { label: "Accepted", color: "#3C3489", bg: "#EEEDFE" },
        "in_progress": { label: "In Progress", color: "#633806", bg: "#FAEEDA" },
        cancelled: { label: "Cancelled", color: "#A32D2D", bg: "#FCEBEB" },
        pending: { label: "Pending", color: "#633806", bg: "#FAEEDA" },
    }

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

    return (
        <>
            <style>
                {`
.booking-list { 
display: grid; 
grid-template-columns: 1fr 1fr; 
gap: 0.8rem; 
column-gap: 2rem;
}

            .booking-card {
                    background: #f0f0f0; border: 1px solid rgba(0,0,0,0.07);
                    border-radius: 12px; padding: 13px 15px; display: flex; align-items: center;
                    gap: 12px; transition: border-color 0.15s; cursor: pointer;
                }
                .booking-card:hover { border-color: rgba(0,0,0,0.2); }

                .booking-icon {
                    width: 36px; height: 36px; border-radius: 8px; display: flex;
                    align-items: center; justify-content: center; font-size: 16px;
                    flex-shrink: 0; background: #e0e0e0;
                }

                .booking-info { flex: 1; min-width: 0; }

                .booking-name {
                    font-size: 13px; font-weight: 500; color: #1a1a1a;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;
                }

                .booking-customer {
                    font-size: 11px; color: #777;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }

                .booking-right { text-align: right; flex-shrink: 0; }

                .booking-badge {
                    font-size: 10px; font-weight: 500; padding: 3px 9px;
                    border-radius: 20px; display: inline-block; margin-bottom: 3px;
                }

                .booking-date { font-size: 10px; color: #888; }
                .booking-time { font-size: 10px; color: #999; margin-top: 2px; }

                .empty-state {
                    background: #f0f0f0; border: 1px dashed rgba(0,0,0,0.12);
                    border-radius: 12px; padding: 2rem; text-align: center; color: #888; font-size: 13px;
                }`}
            </style>
            <div className="h-screen">
                <h2 className="flex justify-center items-center py-9 text-[1.75rem] font-bold">All Provider Bookings</h2>
                <div className="max-w-[80rem] m-auto">

                    {!bookingsLoaded ? (
                        <div className="empty-state">Loading bookings...</div>
                    ) : providerBookings?.length === 0 ? (
                        <div className="empty-state">No bookings yet.</div>
                    )
                        :
                        (
                            <div className="booking-list">
                                {providerBookings?.map((b, i) => {
                                    const status = statusMeta[b.status] || statusMeta.pending
                                    const icon = serviceIcons[b.serviceType] || "🛠️"
                                    return (
                                        <div className="booking-card" key={i} onClick={() => navigate(`/bookings/${b._id}`)}>
                                            <div className="booking-icon">{icon}</div>
                                            <div className="booking-info">
                                                <div className="booking-name">{b.serviceType}</div>
                                                <div className="booking-customer">
                                                    {b.address?.area
                                                        ? `${b.address.area}${b.address.street ? `, ${b.address.street}` : ""}`
                                                        : "Address not set"}
                                                </div>
                                            </div>
                                            <div className="booking-right">
                                                <div
                                                    className="booking-badge"
                                                    style={{ background: status.bg, color: status.color }}
                                                >
                                                    {status.label}
                                                </div>
                                                <div className="booking-date">
                                                    {new Date(b.date).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </div>
                                                {b.startTimeSlot && b.endTimeSlot && (
                                                    <div className="booking-time">
                                                        {b.startTimeSlot} – {b.endTimeSlot}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                )
                                }
                            </div>
                        )
                    }
                </div>
            </div >
        </>
    )
}