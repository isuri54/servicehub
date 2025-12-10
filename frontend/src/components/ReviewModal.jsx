import { useState } from "react";
import axios from "axios";

const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!comment.trim()) return alert("Please write a review");

    setLoading(true);
    try {
      await axios.post("/api/bookings/review", {
        bookingId: booking._id,
        providerId: booking.provider._id,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      onSuccess();
      onClose();
      alert("Thank you! Your review has been submitted.");
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Rate Your Experience</h2>
        <div className="text-center mb-8">
          <p className="text-xl font-semibold">{booking.provider.name}</p>
          <p className="text-gray-600">{booking.provider.category} • {booking.provider.district}</p>
        </div>

        <div className="flex justify-center gap-3 my-8">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition transform hover:scale-125"
            >
              <span className={`text-5xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
                ★
              </span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this provider..."
          rows="5"
          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none text-lg"
        />

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
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

export default ReviewModal;