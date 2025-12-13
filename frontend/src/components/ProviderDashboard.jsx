import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ContactClientModal from "./ContactClientModal";
import AvailabilityModal from "./AvailabilityModal";
import QuickStatsModal from "./QuickStatsModal";
import EarningsModal from "./EarningsModal";
import ProviderChatModal from "./ProviderChatModal";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const pendingBookings = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [providerRating, setProviderRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchProviderAndBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const bookingsRes = await axios.get("/api/bookings/provider-bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const bookingsData = bookingsRes.data.bookings || [];

        setBookings(bookingsData);
        setLoading(false);

        if (bookingsRes.data.rating !== undefined) {
          setProviderRating(bookingsRes.data.rating);
          setReviewCount(bookingsRes.data.reviewCount || 0);
        } else if (bookingsData.length > 0 && bookingsData[0].provider) {
          setProviderRating(bookingsData[0].provider.rating || 0);
          setReviewCount(bookingsData[0].provider.reviewCount || 0);
        } else {
          setProviderRating(0);
          setReviewCount(0);
        }

      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchProviderAndBookings();
  }, [navigate]);

    const handleAccept = async (bookingId) => {
      try {
        await axios.put(`/api/bookings/accept/${bookingId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setBookings(bookings.map(b =>
          b._id === bookingId ? { ...b, status: "confirmed" } : b
        ));
      } catch (err) {
        alert("Failed to accept booking");
      }
    };

    const stats = {
      totalRequests: pendingBookings.length,
      activeJobs: confirmedBookings.length,
      completedJobs: bookings.filter(b => b.status === "completed").length,
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.clear();
      navigate("/login");
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
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
            <div className="cursor-pointer" onClick={() => navigate("/provider-profile")}>
              <p className="font-semibold">{currentUser?.name || "Provider"}</p>
              <p className="text-xs text-green-200">Verified Provider</p>
            </div>
          </div>
          <button
            onClick={() => setShowChatModal(true)}
            className="p-2 rounded-full hover:bg-[#01336F] transition relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12c0 4.418-4.03 8-9 8-1.31 0-2.56-.23-3.68-.65L3 21l1.35-4.05A7.92 7.92 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 11l3 3 5-5"
              />
            </svg>

            <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
          </button>
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
              <p className="text-3xl font-bold text-yellow-500 mt-1">
              {providerRating > 0 ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(providerRating) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}{" "}
                  <span className="text-2xl text-gray-700">({providerRating.toFixed(1)})</span>
                </>
              ) : (
                "No ratings yet"
              )}
            </p>
            {reviewCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">{reviewCount} review{reviewCount > 1 ? "s" : ""}</p>
            )}
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
        {pendingBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
            <p className="text-xl text-gray-500">No new requests</p>
            <p className="text-gray-400 mt-2">You'll be notified when clients book you!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-md border border-yellow-100 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.client.profileImage || "/user.png"}
                      alt={booking.client.name}
                      className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{booking.client.name}</h3>
                      <p className="text-gray-600">{booking.client.district || "Unknown location"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(booking.dateRange.start)}
                        {booking.dateRange.start !== booking.dateRange.end && (
                          <> → {formatDate(booking.dateRange.end)}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      New Request
                    </span>
                    <button
                      onClick={() => handleAccept(booking._id)}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition shadow-md"
                    >
                      Accept Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Active Jobs ({confirmedBookings.length})
        </h2>
        {confirmedBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
            <p className="text-xl text-gray-500">No active jobs</p>
            <p className="text-gray-400 mt-2">Accept a request to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {confirmedBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.client.profileImage || "/user.png"}
                      alt={booking.client.name}
                      className="w-14 h-14 rounded-full border-2 border-green-300 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{booking.client.name}</h3>
                      <p className="text-gray-600">{booking.client.district || "Unknown location"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(booking.dateRange.start)}
                        {booking.dateRange.start !== booking.dateRange.end && (
                          <> → {formatDate(booking.dateRange.end)}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                    <button className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition shadow-md" onClick={() => {
                      setSelectedClient(booking.client);
                      setShowContactModal(true);
                    }}>
                      Contact Client
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-left border border-green-100" onClick={() => setShowAvailabilityModal(true)}>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Update Availability</h3>
            <p className="text-gray-600 mt-2">Let clients know when you're free</p>
          </button>

          <button className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-left border border-green-100" onClick={() => setShowStatsModal(true)}>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Quick Stats</h3>
            <p className="text-gray-600 mt-2">Clients served • Response time • Growth</p>
          </button>

          <button className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-left border border-green-100" onClick={() => setShowEarningsModal(true)}>
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

      <ContactClientModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        client={selectedClient}
      />
      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
      />
      <QuickStatsModal 
        isOpen={showStatsModal} 
        onClose={() => setShowStatsModal(false)} 
      />
      <EarningsModal
        isOpen={showEarningsModal}
        onClose={() => setShowEarningsModal(false)}
      />
      <ProviderChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </div>
  );
};

export default ProviderDashboard;