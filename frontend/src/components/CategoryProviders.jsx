import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryProviders = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
      <nav className="w-full bg-[#00204A] text-white shadow-lg py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/servicehub.png" alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold">ServiceHub</h1>
        </div>
        <div className="flex items-center gap-8">
          <button className="hover:text-green-300 text-lg">Categories</button>
          <button
            onClick={() => navigate("/provider")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Become Provider
          </button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/login")}>
            <img src="/user.png" alt="profile" className="w-10 h-10 rounded-full border-2 border-white" />
            <span className="font-semibold">Sign In</span>
          </div>
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
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">4.8 (28 reviews)</span>
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

                <button className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryProviders;