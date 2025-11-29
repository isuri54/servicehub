import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);

      setSuccess('Login successful! Welcome back.');
      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate('/dashboard', { state: { user: response.data.user } });
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setShowSuccessMessage(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-emerald-200">
      
      <div className="max-w-lg w-full mx-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-green-100">
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-14 w-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">SH</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2 text-sm">Sign in to your ServiceHub account</p>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-green-800">Login Successful!</h3>
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
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm font-semibold text-green-600 hover:text-green-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

          </form>
        )}

        {!showSuccessMessage && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="font-semibold text-green-600 hover:text-green-500"
              >
                Create a new account
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
