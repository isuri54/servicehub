import { useState } from "react";
import axios from "axios";

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Moneragala", "Ratnapura", "Kegalle"
];

const DistrictModal = ({ isOpen, onClose, onSuccess }) => {
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!district) return alert("Please select your district");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/auth/add-district", { district }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess(district);
      onClose();
    } catch (err) {
      alert("Failed to save district");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Where are you located?
        </h2>
        <p className="text-center text-gray-600 mb-8">
          This helps providers serve you better. You only need to set this once.
        </p>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
        >
          <option value="">Select Your District</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={loading || !district}
            className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistrictModal;