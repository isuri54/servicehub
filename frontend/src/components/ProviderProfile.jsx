import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    district: "",
    education: "",
    experience: "",
  });
  const [previewImage, setPreviewImage] = useState("/user.png");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userRes = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(userRes.data.user);

        const providerRes = await axios.get("/api/providers/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const p = providerRes.data.provider;

        setFormData({
          name: userRes.data.user.name || "",
          phone: userRes.data.user.phone || "",
          category: p.category || "",
          district: p.district || "",
          education: p.education || "",
          experience: p.experience || "",
        });

        setPreviewImage(p.profileImage || "/user.png");
        setProvider(p);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("category", formData.category);
      data.append("district", formData.district);
      data.append("education", formData.education);
      data.append("experience", formData.experience);
      if (imageFile) data.append("profileImage", imageFile);

      const res = await axios.put("/api/providers/update", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setProvider(res.data.provider);
      setCurrentUser(prev => ({ ...prev, name: formData.name }));
      localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, name: formData.name }));

      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
          <p className="mt-6 text-xl text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
      <nav className="w-full bg-[#00204A] text-white shadow-lg py-4 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/provider-dashboard")}>
          <img src="/servicehub.png" alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold">ServiceHub</h1>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-green-300 font-medium">Provider Portal</span>
          <div className="flex items-center gap-3">
            <img src={previewImage} alt="profile" className="w-10 h-10 rounded-full border-2 border-white" />
            <div>
              <p className="font-semibold">{currentUser?.name || "Provider"}</p>
              <p className="text-xs text-green-200">Verified Provider</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("currentUser");
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-12 text-center text-white">
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Profile"
                className="w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover"
              />
              {editing && (
                <label className="absolute bottom-2 right-2 bg-white text-green-600 p-3 rounded-full cursor-pointer shadow-lg hover:bg-gray-100 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            <h1 className="text-4xl font-bold mt-6">{editing ? formData.name : (currentUser?.name || "Provider")}</h1>
            <p className="text-2xl text-green-100 mt-2">{editing ? formData.category : (provider?.category || "Specialist")}</p>
          </div>

          <div className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                className={`px-6 py-3 rounded-xl font-bold transition ${editing ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
              >
                {editing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
            </div>

            {editing && (
              <div className="mt-10 flex gap-4 justify-center">
                <button
                  onClick={handleSave}
                  className="px-10 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg"
                >
                  Save All Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-10 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;