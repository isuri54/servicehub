import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProviderRegistration = () => {
  const [form, setForm] = useState({
    category: "",
    district: "",
    education: "",
    experience: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [workImages, setWorkImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const userId = user?.id;

      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("userId", userId);
      data.append("category", form.category);
      data.append("district", form.district);
      data.append("education", form.education);
      data.append("experience", form.experience);

      if (profileImage) data.append("profileImage", profileImage);
      workImages.forEach((file) => data.append("workImages", file));

      const response = await axios.post("/api/provider/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const updatedUser = {
          ...user,
          isProvider: true,
          providerDetails: {
            category: form.category,
            district: form.district,
            education: form.education,
            experience: form.experience,
            profileImage: response.data.profileImage 
              ? response.data.profileImage 
              : user.profileImage,
            workImages: response.data.workImages || [],
          },
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        setSuccess("Provider registration completed successfully!");
        setTimeout(() => {
          navigate("/provider-dashboard");
        }, 1500);
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Provider registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">

      <div className="max-w-2xl w-full mx-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-green-100">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-14 w-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">SH</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900">Become a Provider</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Add your professional details to start offering services
          </p>
        </div>

        {success && (
          <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-green-800">Success</h3>
                <p className="mt-1 text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl shadow-sm">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="w-full bg-gray-50 px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Upload Work Photos (Max 5)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setWorkImages([...e.target.files])}
              className="w-full bg-gray-50 px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>

          <select
            name="category"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Category</option>
            <option>Weldeing</option>
            <option>Plumbing</option>
            <option>Painting</option>
            <option>Carpentry</option>
            <option>Construction</option>
            <option>Cleaning</option>
            <option>Driving</option>
            <option>Roofing</option>
            <option>Landscaping</option>
            <option>Appliace Repair</option>
          </select>

          <select
            name="district"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select District</option>
            <option>Colombo</option>
            <option>Kandy</option>
            <option>Galle</option>
            <option>Jaffna</option>
          </select>

          <select
            name="education"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Education</option>
            <option>NVQ Level 3</option>
            <option>NVQ Level 4</option>
            <option>Diploma</option>
            <option>Self-Taught</option>
          </select>

          <select
            name="experience"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Experience (Years)</option>
            <option>0-2 Year</option>
            <option>2-5 Years</option>
            <option>5-10 Years</option>
            <option>10-15 Years</option>
            <option>15+ Years</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Provider Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderRegistration;
