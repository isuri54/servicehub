import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AvailabilityModal = ({ isOpen, onClose }) => {
  const [workingDays, setWorkingDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");

          const bookingsRes = await axios.get("/api/bookings/provider-bookings", {
            headers: { Authorization: `Bearer ${token}` }
          });

          setBookedDates(bookingsRes.data.bookedDates || []);

          const profileRes = await axios.get("/api/provider/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });

          const p = profileRes.data.provider;
          setWorkingDays(p.workingDays || []);
          setStartTime(p.startTime || "09:00");
          setEndTime(p.endTime || "17:00");
          setUnavailableDates(p.unavailableDates || []);

          setLoading(false);
        } catch (err) {
          console.error("Failed to load availability:", err);
          alert("Failed to load your availability");
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleDayToggle = (day) => {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleUnavailableClick = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    setUnavailableDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  const isDateBooked = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return bookedDates.includes(dateStr);
  };

  const isDateUnavailable = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return unavailableDates.includes(dateStr);
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/provideravailability/availability", {
        workingDays,
        startTime,
        endTime,
        unavailableDates
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      alert("Availability updated successfully!");
      onClose();
    } catch (err) {
      alert("Failed to save availability");
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    if (isDateBooked(date)) {
      return "bg-gray-300 text-gray-700 rounded-x1 font-medium cursor-not-allowed";
    }
    if (isDateUnavailable(date)) {
      return "bg-red-500 text-white rounded-full font-bold";
    }
    if (workingDays.includes(daysOfWeek[date.getDay()])) {
      return "bg-green-100 text-green-700 rounded-full";
    }
    return "";
  };

  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;
    return isDateBooked(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-8 text-white relative">
          <h2 className="text-3xl font-bold text-center">Update Your Availability</h2>
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
          <div className="p-8 space-y-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Select Your Working Days</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition">
                    <input
                      type="checkbox"
                      checked={workingDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="w-6 h-6 rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-lg font-medium text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Mark Unavailable Days (Click on Calendar)
              </h3>
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                <Calendar
                  tileClassName={tileClassName}
                  tileDisabled={tileDisabled}
                  onClickDay={handleUnavailableClick}
                  minDate={new Date()}
                  className="mx-auto"
                />
                <div className="flex justify-center gap-10 mt-8 text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div> Booked by Client
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div> Unavailable (You Blocked)
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full"></div> Available
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 pt-8">
              <button
                onClick={handleSave}
                className="flex-1 py-5 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition shadow-lg"
              >
                Save Availability
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-5 border-2 border-gray-300 text-gray-700 text-xl font-bold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityModal;