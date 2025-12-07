import React, { useState, useEffect } from "react";
import axios from "axios";

const QuickStatsModal = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState({
    totalClients: 0,
    completionRate: 0,
    avgResponseTime: "N/A",
    repeatClients: 0,
    thisMonthJobs: 0,
    lastMonthJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchStats = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("/api/bookings/provider-stats", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(res.data.stats);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [isOpen]);

  const growth = stats.thisMonthJobs - stats.lastMonthJobs;
  const growthPercent = stats.lastMonthJobs > 0 
    ? Math.round((growth / stats.lastMonthJobs) * 100) 
    : stats.thisMonthJobs > 0 ? 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-8 text-white relative">
          <h2 className="text-3xl font-bold text-center">My Quick Stats</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
          </div>
        ) : (
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border-2 border-green-200">
                <p className="text-gray-600 text-lg font-medium">Clients Served</p>
                <p className="text-5xl font-bold text-green-700 mt-3">{stats.totalClients}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 text-center border-2 border-yellow-200">
                <p className="text-gray-600 text-lg font-medium">Completion Rate</p>
                <p className="text-5xl font-bold text-yellow-700 mt-3">{stats.completionRate}%</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-blue-200">
                <p className="text-gray-600 text-lg font-medium">Avg Response Time</p>
                <p className={`text-5xl font-bold mt-3 ${stats.avgResponseTime === "N/A" ? "text-gray-500" : "text-blue-700"}`}>
                    {stats.avgResponseTime}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center border-2 border-purple-200">
                <p className="text-gray-600 text-lg font-medium">Repeat Clients</p>
                <p className="text-5xl font-bold text-purple-700 mt-3">{stats.repeatClients}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
              <p className="text-2xl font-medium">This Month vs Last Month</p>
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="text-center">
                  <p className="text-lg opacity-90">Last Month</p>
                  <p className="text-4xl font-bold">{stats.lastMonthJobs}</p>
                </div>
                <div className="text-6xl">
                  {growth > 0 ? "↑" : growth < 0 ? "↓" : "→"}
                </div>
                <div className="text-center">
                  <p className="text-lg opacity-90">This Month</p>
                  <p className="text-4xl font-bold">{stats.thisMonthJobs}</p>
                </div>
              </div>
              <p className="text-3xl font-bold mt-6">
                {growth > 0 ? `+${growthPercent}%` : growth < 0 ? `${growthPercent}%` : "No change"}
              </p>
            </div>

            <div className="text-center pt-6">
              <button
                onClick={onClose}
                className="px-10 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStatsModal;