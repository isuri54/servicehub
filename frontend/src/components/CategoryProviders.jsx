import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileModal from './UserProfile';
import ClientChatModal from "./ClientChatModal";

const CategoryProviders = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const [showChatInbox, setShowChatInbox] = useState(false);

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
    const fetchProviders = async () => {
      try {
        const response = await axios.get(`/api/providers/category/${encodeURIComponent(categoryName)}`);
        
        setProviders(response.data.providers || []);
        setLoading(false);
      } catch (err) {
        setError("No providers found for this category yet.");
        setLoading(false);
      }
    };

    fetchProviders();
  }, [categoryName]);

  const formatCategoryName = (name) => {
    return name
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleProvider = () => {
    navigate('/provider');
  };

  const handleBookingsClick = () => {
    navigate('/my-bookings');
  };

  const handleCategoryClick = (name) => {
    const formatted = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${formatted}`);
    setShowCategories(false);
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
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {formatCategoryName(categoryName)} Experts
          </h1>
          <p className="text-xl text-green-100">
            Choose from verified and experienced {formatCategoryName(categoryName).toLowerCase()} professionals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading providers...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full border-4 border-dashed border-gray-400"></div>
            <p className="text-2xl font-semibold text-gray-700">{error}</p>
            <p className="text-gray-600 mt-2">Be the first provider in this category!</p>
            <button
              onClick={() => navigate("/provider")}
              className="mt-6 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
            >
              Become a {formatCategoryName(categoryName)} Provider
            </button>
          </div>
        )}

        {!loading && !error && providers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold text-gray-700">No providers available yet</p>
            <button
              onClick={() => navigate("/provider")}
              className="mt-6 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
            >
              Be the First Provider
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => navigate(`/provider/${provider._id}`)}
            >
              <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                {provider.profileImage ? (
                  <img
                    src={provider.profileImage}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-600">
                        {provider.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Verified
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                <p className="text-green-600 font-medium mt-1">{provider.category}</p>
                <p className="text-gray-600 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {provider.district}
                </p>

                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-500">
                    {provider.rating > 0 ? (
                      [...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(provider.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No ratings yet</span>
                    )}
                  </div>
                  {provider.rating > 0 && (
                    <span className="ml-2 text-gray-600 font-medium">
                      {provider.rating.toFixed(1)} ({provider.reviewCount || 0} review{provider.reviewCount !== 1 ? "s" : ""})
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-semibold text-gray-900">{provider.experience}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Education</p>
                    <p className="font-semibold text-green-600">{provider.education}</p>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition" onClick={() => navigate(`/provider/${provider._id}`)}>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ClientChatModal
        isOpen={showChatInbox}
        onClose={() => setShowChatInbox(false)}
      />
    </div>
  );
};

export default CategoryProviders;