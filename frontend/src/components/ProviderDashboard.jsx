import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Dummy data - later will come from backend
  const serviceRequests = [
    { id: 1, client: "Nimal Perera", location: "Colombo 7", date: "2025-04-05", status: "pending" },
    { id: 2, client: "Sunil Silva", location: "Kandy", date: "2025-04-04", status: "pending" },
    { id: 3, client: "Kamal Fernando", location: "Galle", date: "2025-04-02", status: "accepted" },
  ];

  const stats = {
    totalRequests: 12,
    activeJobs: 3,
    completedJobs: 28,
    rating: 4.8,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
      {/* Navbar - Same as main site */}
      <nav className="w-full bg-[#00204A] text-white shadow-lg py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/provider-dashboard")}>
          <img src="/servicehub.png" alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold">ServiceHub</h1>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-green-300 font-medium">Provider Portal</span>
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.profileImage || "/user.png"}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <p className="font-semibold">{currentUser?.name || "Provider"}</p>
              <p className="text-xs text-green-200">Verified Provider</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome back, <span className="text-green-600">{currentUser?.name?.split(" ")[0] || "Provider"}!</span>
          </h1>
          <p className="text-xl text-gray-600 mt-3">Here are your latest service requests and stats</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.activeJobs}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedJobs}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Your Rating</p>
              <p className="text-3xl font-bold text-yellow-500 mt-1">★★★★★ {stats.rating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.316 9.39c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.963z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">New Service Requests</h2>
        <div className="grid gap-6">
          {serviceRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full border-2 border-dashed border-gray-400"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{req.client}</h3>
                    <p className="text-gray-600">{req.location}</p>
                    <p className="text-sm text-gray-500 mt-1">Requested on: {req.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    req.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}>
                    {req.status === "pending" ? "New Request" : "Accepted"}
                  </span>
                  <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition">
                    {req.status === "pending" ? "Accept Job" : "View Details"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-left border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Update Availability</h3>
            <p className="text-gray-600 mt-2">Let clients know when you're free</p>
          </button>

          <button className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-left border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">View My Services</h3>
            <p className="text-gray-600 mt-2">Manage your listed services</p>
          </button>

          <button className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-left border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4-8h-2a2 2 0 00-2 2v6a2 2 0 002 2h2m6-8v8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Earnings & Payments</h3>
            <p className="text-gray-600 mt-2">Check your income and payout status</p>
          </button>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default ProviderDashboard;