import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import UserProfileModal from './UserProfile';
import CallProviderModal from "./CallProviderModal";
import ChatModal from "./ChatModal";
import ClientChatModal from "./ClientChatModal";
import DistrictModal from "./DistrictModal";

const ProviderProfileView = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLongTerm, setIsLongTerm] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const token = localStorage.getItem("token");
  const [showProfile, setShowProfile] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showChatInbox, setShowChatInbox] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [hasDistrict, setHasDistrict] = useState(false);

  const categories = [
    { id: 1, name: "Plumbing", image: "/plumbing.jpg", bgColor: "bg-blue-500" },
    { id: 2, name: "Welding", image: "/welding.jpg", bgColor: "bg-yellow-500" },
    { id: 3, name: "Carpentry", image: "/carpentry.jpg", bgColor: "bg-brown-600" },
    { id: 4, name: "Painting", image: "/painting.jpeg", bgColor: "bg-red-500" },
    { id: 5, name: "Cleaning", image: "/cleaning.jpeg", bgColor: "bg-green-500" },
    { id: 6, name: "Driving", image: "/driving.jpg", bgColor: "bg-indigo-500" },
    { id: 7, name: "Roofing", image: "/roofing.jpeg", bgColor: "bg-gray-700" },
    { id: 8, name: "Landscaping", image: "/landscaping.jpg", bgColor: "bg-emerald-600" },
    { id: 9, name: "Construction", image: "/construction.jpg", bgColor: "bg-orange-500" },
    { id: 10, name: "Appliance Repair", image: "/appliance-repair.jpg", bgColor: "bg-purple-600" }
  ];

  
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
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const res = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });

          const user = res.data.user;
          setCurrentUser(user);
          setHasDistrict(!!user.district);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };
      fetchUser();
    }, []);

    useEffect(() => {
        const fetchProvider = async () => {
        try {
            const response = await axios.get(`/api/providerprofile/profileview/${providerId}`);
            const providerData = response.data.provider;

            setProvider(response.data.provider);
            const availabilityRes = await axios.get(`/api/bookings/availability/${providerId}`);
            setBookedDates(availabilityRes.data.bookedDates || []);

            setUnavailableDates(providerData.unavailableDates || []);
            setLoading(false);
        } catch (err) {
            setError("Provider not found or unavailable.");
            setLoading(false);
        }
        };
        fetchProvider();
    }, [providerId]);

    const handleCategoryClick = (name) => {
      const formatted = name.toLowerCase().replace(/\s+/g, "-");
      navigate(`/category/${formatted}`);
      setShowCategories(false);
    };

    const startBookingProcess = () => {
      if (!hasDistrict) {
        setShowDistrictModal(true);
        return;
      }
      setShowBookingModal(true);
    };


    const handleDateChange = (date) => {
        setSelectedDate(date);
        setBookingError("");
    };

    const handleBooking = async () => {
        if (!selectedDate) {
        setBookingError("Please select a date or range.");
        return;
        }

        try {
        const bookingData = {
            providerId,
            selectedDate,
            isLongTerm,
        };

        const response = await axios.post("/api/bookings/create", bookingData, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
        setBookingSuccess("Booking confirmed! We'll notify the provider.");
        setTimeout(() => {
            setShowBookingModal(false);
            navigate("/my-bookings");
        }, 2000);
        } catch (err) {
        setBookingError(err.response?.data?.message || "Booking failed. Try again.");
        }
    };

    const isDateBooked = ({ date, view }) => {
      if (view !== "month") return false;

      const dateStr = date.toISOString().split("T")[0];

      const isBooked = bookedDates.some(
        (booked) => date >= new Date(booked.start) && date <= new Date(booked.end)
      );

      const isUnavailable = unavailableDates.includes(dateStr);

      return isBooked || isUnavailable;
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
        </div>
        );
    }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center">
        <div className="text-center py-20">
          <p className="text-3xl font-bold text-gray-700 mb-4">Provider Not Found</p>
          <button onClick={() => navigate(-1)} className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
          <p className="mt-6 text-xl text-gray-700">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center">
        <div className="text-center py-20">
          <p className="text-3xl font-bold text-gray-700 mb-4">Provider Not Found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Go Back
          </button>
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
      <nav className="w-full bg-[#00204A] text-white shadow-lg py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home') }>
          <img src="/servicehub.png" alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold">ServiceHub</h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative" ref={categoriesRef}>
            <button
              onMouseEnter={() => setShowCategories(true)}
              className="hover:text-green-300 text-lg font-medium transition"
            >
              Categories
            </button>

            {showCategories && (
              <div
                onMouseLeave={() => setShowCategories(false)}
                className="absolute top-12 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200"
              >
                <div className="grid gap-2 p-3 max-h-96 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition group cursor-pointer"
                    >
                      <span className="text-gray-800 font-medium group-hover:text-green-600">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="hover:text-green-300 text-lg" onClick={handleBookingsClick}>My Bookings</button>

          <button
            onClick={handleProvider}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Become Provider
          </button>

          <button
            onClick={() => setShowChatInbox(true)}
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

          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setShowProfile(true)}>

              <img src={currentUser?.profileImage || "/user.png"} alt="profile" className="w-10 h-10 rounded-full border-2 border-white" />
              <span className="font-semibold">{currentUser?.name || "Guest"}</span>
          </div>

          <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <img
                  src={provider.profileImage || "/user.png"}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Verified
              </div>
            </div>

            <div className="text-center md:text-left text-white">
              <h1 className="text-5xl font-bold mb-3">{provider.name}</h1>
              <p className="text-2xl text-green-100 mb-4">{provider.category} Specialist</p>
              <div className="flex items-center justify-center md:justify-start gap-6 text-lg">
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {provider.district}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {provider.experience}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
              <div className="space-y-5 text-lg text-gray-700">
                <p>
                  <strong className="text-green-600">Education:</strong> {provider.education}
                </p>
                <p>
                  <strong className="text-green-600">Experience:</strong> {provider.experience}
                </p>
                <p>
                  <strong className="text-green-600">Service Area:</strong> {provider.district} and nearby areas
                </p>
                <p>
                  <strong className="text-green-600">Availability:</strong> Monday–Saturday, 8 AM–6 PM
                </p>
              </div>
            </div>

            {provider.workImages && provider.workImages.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">My Work</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {provider.workImages.map((img, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg">
                      <img
                        src={img}
                        alt={`Work ${index + 1}`}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Client Reviews</h2>
              <div className="text-center">
                <div className="flex justify-center text-yellow-500 text-2xl mb-2">
                  {provider.rating > 0 ? (
                    [...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-8 h-8 ${i < Math.round(provider.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))
                  ) : (
                    <span className="text-gray-400">No ratings yet</span>
                  )}
                </div>
                {provider.rating > 0 ? (
                  <>
                    <p className="text-4xl font-bold text-gray-900">{provider.rating.toFixed(1)}</p>
                    <p className="text-gray-600">
                      Based on {provider.reviewCount || 0} review{provider.reviewCount !== 1 ? "s" : ""}
                    </p>
                  </>
                ) : (
                  <p className="text-xl text-gray-500 mt-4">Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border border-green-100 sticky top-24">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-8 text-center text-white">
                <h3 className="text-2xl font-bold">Hire {provider.name.split(" ")[0]}</h3>
                <p className="mt-3 text-green-100">Get professional service today</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="text-center">
                  <div className="flex justify-center text-yellow-500 text-2xl mb-2">
                    {provider.rating > 0 ? (
                      [...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-8 h-8 ${i < Math.round(provider.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))
                    ) : (
                      <span className="text-gray-400 text-2xl">No ratings yet</span>
                    )}
                  </div>

                  {provider.rating > 0 ? (
                    <>
                      <p className="text-4xl font-bold text-gray-900">{provider.rating.toFixed(1)}</p>
                      <p className="text-lg text-gray-600">
                        Based on {provider.reviewCount || 0} review{provider.reviewCount !== 1 ? "s" : ""}
                      </p>
                    </>
                  ) : (
                    <p className="text-xl text-gray-500 mt-4">Be the first to review!</p>
                  )}
                </div>

                <div className="space-y-4">
                  <button className="w-full py-5 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 transition shadow-lg" onClick={() => setShowChatModal(true)}>
                    Send Message
                  </button>
                  <button className="w-full py-5 border-2 border-green-600 text-green-600 text-lg font-bold rounded-xl hover:bg-green-600 hover:text-white transition" onClick={() => setShowCallModal(true)}>
                    Call Provider
                  </button>
                  <button className="w-full py-5 bg-emerald-600 text-white text-lg font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg" onClick={() => startBookingProcess(true)}>
                    Book Service
                  </button>

                  {showBookingModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
                        <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>

                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Book {provider.name}</h2>

                        <div className="mb-6">
                        <label className="flex items-center gap-3 text-lg text-gray-700">
                            <input
                            type="checkbox"
                            checked={isLongTerm}
                            onChange={(e) => setIsLongTerm(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-green-600"
                            />
                            Long-term project (select date range)
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                            {isLongTerm ? "Select start and end dates for projects like construction or roofing." : "Select a single day for short services."}
                        </p>
                        </div>

                        <Calendar
                          onChange={handleDateChange}
                          value={selectedDate}
                          selectRange={isLongTerm}
                          minDate={new Date()}
                          tileDisabled={isDateBooked}
                          tileClassName={({ date, view }) => {
                            if (view !== "month") return "";
                            const dateStr = date.toISOString().split("T")[0];
                            if (unavailableDates.includes(dateStr)) {
                              return "bg-red-200 text-red-700 rounded-x1 font-medium";
                            }
                            return "";
                          }}
                          className="border border-gray-300 rounded-xl shadow-md w-full"
                        />

                        {bookingError && <p className="mt-4 text-red-600">{bookingError}</p>}
                        {bookingSuccess && <p className="mt-4 text-green-600">{bookingSuccess}</p>}

                        <button
                        onClick={handleBooking}
                        disabled={loading}
                        className="w-full mt-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                        >
                        {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                    </div>
                )}
                </div>

                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Response time: Within 1 hour</p>
                  <p className="text-sm text-gray-500 mt-1">Member since 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CallProviderModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        provider={{
          name: provider.name,
          profileImage: provider.profileImage,
          category: provider.category,
          district: provider.district,
          phone: provider.phone
        }}
      />
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        provider={provider}
        currentUser={currentUser}
      />
      <ClientChatModal
        isOpen={showChatInbox}
        onClose={() => setShowChatInbox(false)}
      />
      <DistrictModal
        isOpen={showDistrictModal}
        onClose={() => setShowDistrictModal(false)}
        onSuccess={(d) => {
          setHasDistrict(true); 
          setCurrentUser({ ...currentUser, district: d });
          localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, district: d }));
          setShowBookingModal(true);
        }}
      />
    </div>
  );
};

export default ProviderProfileView;