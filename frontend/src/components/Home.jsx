import {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileModal from './UserProfile';
import ClientChatModal from './ClientChatModal';

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const [showChatInbox, setShowChatInbox] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (name) => {
    const formatted = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${formatted}`);
    setShowCategories(false);
  };

  const visibleCategories = categories.slice(currentIndex, currentIndex + 5);

  const nextSlide = () => {
    if (currentIndex < 5) {
      setCurrentIndex(currentIndex + 5);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 5);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
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
      <nav className="w-full bg-[#00204A] text-white shadow-lg py-4">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/servicehub.png" alt="logo" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl font-bold hidden sm:block">ServiceHub</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
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
                  className="absolute top-12 left-1/2 -translate-x-1/2 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="grid gap-2 p-3 max-h-96 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.name)}
                        className="p-3 rounded-xl hover:bg-green-50 transition text-left"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="hover:text-green-300 text-lg" onClick={handleBookingsClick}>
              My Bookings
            </button>

            <button
              onClick={handleProvider}
              className="px-4 py-2 bg-green-600 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Become Provider
            </button>

            <button
              onClick={() => setShowChatInbox(true)}
              className="p-2 rounded-full hover:bg-[#01336F] transition relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8-1.31 0-2.56-.23-3.68-.65L3 21l1.35-4.05A7.92 7.92 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11l3 3 5-5" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfile(true)}>
              <img src={currentUser?.profileImage || "/user.png"} alt="profile" className="w-10 h-10 rounded-full border-2 border-white" />
              <span className="font-semibold hidden lg:block">{currentUser?.name || "Guest"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#00204A] border-t border-gray-700">
            <div className="px-6 py-4 space-y-4">
              <button className="block w-full text-left text-lg hover:text-green-300" onClick={handleBookingsClick}>
                My Bookings
              </button>
              <button className="block w-full text-left text-lg hover:text-green-300" onClick={handleProvider}>
                Become Provider
              </button>
              <button className="block w-full text-left text-lg hover:text-green-300" onClick={() => setShowChatInbox(true)}>
                Messages
              </button>
              <div className="flex items-center gap-3 py-2 border-t border-gray-600" onClick={() => setShowProfile(true)}>
                <img src={currentUser?.profileImage || "/user.png"} alt="profile" className="w-10 h-10 rounded-full border-2 border-white" />
                <span className="font-semibold">{currentUser?.name || "Guest"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 py-3 bg-red-600 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="relative" onClick={() => setShowDropdown(false)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Connect with Trusted
                <span className="text-green-600"> Service Providers</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Find skilled professionals for all your service needs. Whether you need repairs,
                maintenance, or specialized services, our platform connects you with verified providers in your area.
              </p>

              <div className="flex justify-center lg:justify-start mb-10">
                <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search for a category..."
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                  />

                  {showDropdown && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      {filteredCategories.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">No category found</p>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {filteredCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                handleCategoryClick(cat.name);
                                setSearchQuery("");
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-6 py-4 hover:bg-green-50 transition flex items-center gap-4 group"
                            >
                              <div>
                                <p className="font-semibold text-gray-800 group-hover:text-green-600">
                                  {cat.name}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="px-12 py-4 bg-green-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started
                </button>
              </div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="circle c1"></div>
                <div className="circle c2"></div>
                <div className="circle c3"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our most in-demand professional services
            </p>
          </div>

          <div className="relative">
            <div className="flex justify-end mb-8">
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= 5}
                  className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {visibleCategories.map((category) => (
                <div
                  key={category.id}
                  className="group relative bg-green-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`)}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {[0, 5].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'bg-green-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ServiceHub?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to make finding and providing services simple, reliable, and efficient.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition-all duration-300">
              <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Providers</h3>
              <p className="text-gray-600">All service providers are verified to ensure quality and reliability.</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition-all duration-300">
              <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Reviews</h3>
              <p className="text-gray-600">Make informed decisions with reviews and ratings from verified customers.</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition-all duration-300">
              <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Professionals</h3>
              <p className="text-gray-600">Connect with skilled professionals near you for faster service.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of customers and service providers who trust ServiceHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSignupClick}
              className="px-12 py-4 bg-white text-green-600 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Free Account
            </button>
            <button
              onClick={handleLoginClick}
              className="px-12 py-4 text-white font-semibold text-lg rounded-xl border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
      <UserProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
      <ClientChatModal
        isOpen={showChatInbox}
        onClose={() => setShowChatInbox(false)}
      />
    </div>
  );
};

export default Home;