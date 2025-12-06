import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileModal from './UserProfile';
import ReviewModal from "./ReviewModal";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      }
    }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setBookings(response.data.bookings || []);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err.response?.data);
        setError("Failed to load your bookings. Please log in again.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.put(`/api/bookings/cancel/${bookingId}`);
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: "cancelled" } : b
      ));
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const handleComplete = async (bookingId) => {
    if (!window.confirm("Did the provider complete the work successfully?")) return;

    try {
      await axios.put(`/api/bookings/complete/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: "completed" } : b
      ));

      alert("Thank you! You can now leave a review for this provider.");
    } catch (err) {
      alert("Failed to mark as completed");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
          <p className="mt-6 text-xl text-gray-700">Loading your bookings...</p>
        </div>
      </div>
    );
  };

  const handleProvider = () => {
    navigate('/provider');
  };

  const handleBookingsClick = () => {
    navigate('/my-bookings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
      <nav className="w-full bg-[#00204A] text-white shadow-lg py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home') }>
          <img src="/servicehub.png" alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold">ServiceHub</h1>
        </div>

        <div className="flex items-center gap-8">
          <button className="hover:text-green-300 text-lg">Categories</button>
          <button className="hover:text-green-300 text-lg" onClick={handleBookingsClick}>My Bookings</button>

          <button
            onClick={handleProvider}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Become Provider
          </button>

          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setShowProfile(true)}>

              <img src={currentUser?.profileImage || "/user.png"} alt="profile" className="w-10 h-10 rounded-full border-2 border-white" />
              <span className="font-semibold">{currentUser?.name || "Guest"}</span>
          </div>

          <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
      </nav>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">My Bookings</h1>
          <p className="text-xl text-green-100">Manage all your service bookings in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {error && <p className="text-red-600 text-center text-lg">{error}</p>}

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full border-4 border-dashed border-gray-400"></div>
            <p className="text-2xl font-semibold text-gray-700">No bookings yet</p>
            <p className="text-gray-600 mt-2">Start hiring professionals today!</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-8 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-80 p-8 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center gap-6">
                    <img
                      src={booking.provider.profileImage || "/user.png"}
                      alt={booking.provider.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{booking.provider.name}</h3>
                      <p className="text-green-600 font-medium">{booking.provider.category}</p>
                      <p className="text-gray-600 text-sm mt-1">{booking.provider.district}</p>
                    </div>
                  </div>

                  <div className="flex-1 p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Service Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(booking.dateRange.start)}
                          {booking.dateRange.start !== booking.dateRange.end && (
                            <> → {formatDate(booking.dateRange.end)}</>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                          booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                          booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-end justify-end gap-4">
                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                          >
                            Cancel Booking
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleComplete(booking._id)}
                            className="px-4 py-2 bg-white text-green-600 font-bold rounded-xl hover:bg-green-700 transition shadow-lg"
                          >
                            ✔️ Mark as Completed
                          </button>
                        )}

                        {booking.status === "completed" && (
                          <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-amber-400 text-white rounded-xl hover:bg-emerald-700 transition" onClick={() => {
                              setSelectedBooking(booking);
                              setShowReviewModal(true);
                            }}>
                              Leave Review
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => navigate(`/provider/${booking.provider._id}`)}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                        >
                          View Provider
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        booking={selectedBooking}
        onSuccess={() => {
          setShowReviewModal(false);
        }}
      />
    </div>
  );
};

export default MyBookings;