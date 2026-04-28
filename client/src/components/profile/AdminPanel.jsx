import { useState, useEffect } from "react"

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("providers")

  const [users, setUsers] = useState([])
  const [providers, setProviders] = useState([])

  const allUser = async () => {
    const res = await fetch(`${BackEndRoute}/api/admin/all-users`, {
      method: "GET",
      credentials: "include",
    })

    const data = await res.json()

    if (data.success) {
      setUsers(data.allUsers)
    }
  }
  const allProviders = async () => {
    const res = await fetch(`${BackEndRoute}/api/admin/all-providers`, {
      method: "GET",
      credentials: "include",
    })

    const data = await res.json()

    if (data.success) {
      setProviders(data.allProviders)
    }
  }

  useEffect(() => {
    allUser()
    allProviders()
  }, [])

  return (
    <div className="bg-[#f5f4f0] min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <span className="text-sm font-medium tracking-widest uppercase text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>
          Admin Dashboard
        </span>
        <button className="text-xs border border-gray-300 px-4 py-2 hover:bg-gray-100 transition text-gray-600" style={{ fontFamily: "'DM Mono', monospace" }}>
          Logout
        </button>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 flex gap-8">
        {["providers", "users", "bookings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="text-sm py-4 transition-all capitalize"
            style={{
              fontFamily: "'DM Mono', monospace",
              borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent",
              color: activeTab === tab ? "#111" : "#9ca3af",
            }}
          >
            All {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="px-8 py-10 max-w-6xl mx-auto">

        {/* Providers */}
        {activeTab === "providers" && (
          <div>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Providers</p>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Name", "Service", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs text-gray-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {providers?.map((i) =>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{i.name}</td>
                      <td className="px-6 py-4 text-gray-800 flex flex-col justify-center gap-3">
                        {i.services.map((c) =>
                          <span className=" text-gray-500">{c.category}, </span>
                        )}
                      </td>

                      <td className="px-6 py-4"><span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-sm" style={{ fontFamily: "'DM Mono', monospace" }}>{i.isApproved ? 'Verified' : 'Not Verified'}</span></td>
                      <td className="px-6 py-4"><button className="text-xs text-red-400 hover:text-red-600" style={{ fontFamily: "'DM Mono', monospace" }}>Remove</button></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Users</p>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Name", "Email", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs text-gray-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{u.name}</td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4 text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><button className="text-xs text-red-400 hover:text-red-600" style={{ fontFamily: "'DM Mono', monospace" }}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Bookings</p>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["User", "Provider", "Service", "Status"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs text-gray-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800">Ahmed Raza</td>
                    <td className="px-6 py-4 text-gray-500">Ali Hassan</td>
                    <td className="px-6 py-4 text-gray-500">Plumbing</td>
                    <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-sm" style={{ fontFamily: "'DM Mono', monospace" }}>Confirmed</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800">Fatima Malik</td>
                    <td className="px-6 py-4 text-gray-500">Sara Khan</td>
                    <td className="px-6 py-4 text-gray-500">Cleaning</td>
                    <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-sm" style={{ fontFamily: "'DM Mono', monospace" }}>Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

