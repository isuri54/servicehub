import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/signup', formData);
      localStorage.setItem('token', response.data.token);
    
      setSuccess('Account created successfully! Welcome to ServiceHub.');
      setShowSuccessMessage(true);

      setTimeout(() => {
      navigate('/dashboard', { state: { user: response.data.user } });
    }, 700);

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setShowSuccessMessage(false);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-200">
      
      <div className="max-w-lg w-full mx-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">SH</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Join the community of trusted service providers & clients
          </p>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-green-800">Account Created Successfully!</h3>
                <p className="mt-1 text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && !showSuccessMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl shadow-sm">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!showSuccessMessage && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                placeholder="Eg: John Silva"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                placeholder="+94 71 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer flex items-center p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-white">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Service Seeker</span>
                </label>
                <label className="cursor-pointer flex items-center p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-white">
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === 'provider'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Service Provider</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {!showSuccessMessage && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition"
              >
                Sign in here
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Signup;
