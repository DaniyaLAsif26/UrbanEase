import { useState, useEffect } from "react"

const BackEndRoute = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

import { areas, services } from '../../data/services.js'

function SearchInput({ search, setSearch, func }) {
  return (
    <div className="flex justify-center items-center mb-7">
      <input type="text" placeholder="Search" className="px-3 py-2 border-black border-[1.5px] rounded-lg" value={search} onChange={(e) => {
        const value = e.target.value
        setSearch(value)
        func(value)
      }} />
    </div>
  )
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('tab') || 'providers')

  useEffect(() => {
    sessionStorage.setItem('tab', activeTab)
  }, [activeTab])

  const [users, setUsers] = useState([])

  const [providers, setProviders] = useState([])
  const [filteredProviders, setFilteredProviders] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [filters, setFilters] = useState({ area: '', services: '' })
  const [bookingFilters, setBookingFilters] = useState({ area: '', services: '', status: '' })

  const [bookings, setBookings] = useState([])

  const [search, setSearch] = useState('')

  const getAllUsers = async (searchQuery = '') => {
    console.log(searchQuery)
  }

  const getAllProviders = async (searchQuery = '') => {
    console.log(searchQuery)
  }

  const getAllBookings = async (searchQuery = '') => {
    console.log(searchQuery)
  }

  const allUser = async () => {
    const res = await fetch(`${BackEndRoute}/api/admin/all-users`, {
      method: "GET",
      credentials: "include",
    })

    const data = await res.json()

    if (data.success) {
      setUsers(data.allUsers)
      setFilteredUsers(data.allUsers)
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
      setFilteredProviders(data.allProviders)
    }
  }

  const allBookings = async () => {
    const res = await fetch(`${BackEndRoute}/api/admin/all-bookings`, {
      method: "GET",
      credentials: "include",
    })

    const data = await res.json()

    if (data.success) {
      setBookings(data.allBookings)
      setFilteredBookings(data.allBookings)
    }
  }

  useEffect(() => {
    allUser()
    allProviders()
    allBookings()
  }, [])

  const sortProviders = (name, value) => {
    const updated = { ...filters, [name]: value }
    setFilters(updated)

    const filtered = providers.filter(i => {
      const areaMatch = !updated.area || i.area === updated.area
      const serviceMatch = !updated.services || i.services.some(s => s.category === updated.services)
      return areaMatch && serviceMatch
    })

    setFilteredProviders(filtered)
  }

  const sortBookings = (name, value) => {
    const updated = { ...bookingFilters, [name]: value }
    setBookingFilters(updated)

    const filtered = bookings.filter(i => {
      const areaMatch = !updated.area || i.address.area === updated.area
      const serviceMatch = !updated.services || i.serviceType === updated.services
      const statusMatch = !updated.status || i.status === updated.status
      return areaMatch && serviceMatch && statusMatch
    })

    setFilteredBookings(filtered)
  }

  const sortUsers = (value) => {

    if (!value) {
      setFilteredUsers(users)
      return
    }

    const filterUser = users.filter(i => i.address.area === value)

    setFilteredUsers(filterUser)
  }

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
            <p className="text-[1.5rem] text-gray-600 mb-3 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Providers</p>
            <SearchInput search={search} setSearch={setSearch} func={getAllUsers} />
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="flex flex-row gap-7 justify-end py-5 px-3">
                Sort By
                <div className="relative">
                  <select className='border-gray-800 border-[1.5px]'
                    onChange={(e) => sortProviders('area', e.target.value)}
                  >
                    <option value="">Area</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <select className='border-gray-800 border-[1.5px]'
                    onChange={(e) => sortProviders('services', e.target.value)}
                  >
                    <option value="">Services</option>
                    {services.map(a =>
                      a.options.map((s) =>
                        <option key={s.name} value={s.name}>{s.name}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Name", "Service", "Area", "Boohings", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs text-gray-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProviders?.map((i) =>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{i.name}</td>
                      <td className="px-6 py-4 text-gray-800 flex flex-col justify-center gap-3">
                        {i.services.map((c) =>
                          <span className=" text-gray-500">{c.category}, </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {i.area}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {i.bookings.length}
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
            <p className="text-[1.5rem] text-gray-600 mb-6 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Users</p>
            <SearchInput search={search} setSearch={setSearch} func={getAllProviders} />
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="flex flex-row gap-7 justify-end py-5 px-3">
                Sort By
                <div className="relative">
                  <select className='border-gray-800 border-[1.5px]'
                    onChange={(e) => sortUsers(e.target.value)}
                  >
                    <option value="">Area</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Name", "Email", "Area", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs text-gray-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{u.name}</td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4 text-gray-500">{u.address?.area}</td>
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
            <p className="text-[1.5rem] text-gray-600 mb-6 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Bookings</p>
            <SearchInput search={search} setSearch={setSearch} func={getAllBookings} />
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="flex flex-row gap-7 justify-end py-5 px-3">
                Sort By
                <div className="relative">
                  <select className='border-gray-800 border-[1.5px]'
                    onChange={(e) => sortBookings('area', e.target.value)}
                  >
                    <option value="">Area</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <select className='border-gray-800 border-[1.5px]'
                    onChange={(e) => sortBookings('services', e.target.value)}
                  >
                    <option value="">Services</option>
                    {services.map(a =>
                      a.options.map((s) =>
                        <option key={s.name} value={s.name}>{s.name}</option>
                      )
                    )}
                  </select>
                </div>
                <div className="relative">
                  <select className='border-gray-800 border-[1.5px]'
                    onChange={(e) => sortBookings('status', e.target.value)}
                  >
                    <option value="">Services</option>
                    {["pending", "declined", "cancelled", "accepted", "completed"].map(s =>
                      <option key={s} value={s}>{s}</option>
                    )}
                  </select>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["User", "Provider", "Service", "Status"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs text-gray-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((b) =>
                    <tr key={b._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{b.userId?.name}</td>
                      <td className="px-6 py-4 text-gray-500 flex flex-col justify-center ">
                        {b.providers?.map((i) =>
                          <span className="" key={i._id}>{i.name}</span>
                        )}

                      </td>
                      <td className="px-6 py-4 text-gray-500">{b.serviceType}</td>
                      <td className="px-6 py-4"><span className={`bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-sm ${b.status === 'accepted' && 'bg-green-400'} ${b.status === 'pending' && 'bg-orange-300'} ${b.status === 'declined' && 'bg-red-300'}`}
                        style={{ fontFamily: "'DM Mono', monospace" }}>{b.status}</span></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

