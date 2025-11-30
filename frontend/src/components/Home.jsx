import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleProfileClick = () => {
    if (currentUser) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
      <nav className="w-full bg-[#00204A] text-white shadow-lg py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/') }>
          <img src="/servicehub.png" alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold">ServiceHub</h1>
        </div>

        <div className="flex items-center gap-8">
          <button className="hover:text-green-300 text-lg">Categories</button>

          <button
            onClick={handleSignupClick}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Become Provider
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={handleProfileClick}>
            <img
              src="/user.png"
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <span className="font-semibold">
              {currentUser ? currentUser.name : 'Sign In'}
            </span>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
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
                <input
                  type="text"
                  placeholder="Search for a category..."
                  className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleSignupClick}
                  className="px-12 py-4 bg-green-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started
                </button>
                <button
                  onClick={handleLoginClick}
                  className="px-12 py-4 border-2 border-green-600 text-green-600 font-semibold text-lg rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="absolute inset-0 overflow-hidden">
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
    </div>
  );
};

export default Home;