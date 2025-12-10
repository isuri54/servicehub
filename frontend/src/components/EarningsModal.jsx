import { useState, useEffect } from "react";
import axios from "axios";

const EarningsModal = ({ isOpen, onClose }) => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchEarnings();
    }
  }, [isOpen]);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/providers/earnings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEarnings(res.data.earnings || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!amount || !clientName) return alert("Amount and client name required");

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/providers/earnings", {
        amount: Number(amount),
        clientName,
        date,
        note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAmount("");
      setClientName("");
      setNote("");
      setShowAddForm(false);
      fetchEarnings();
      alert("Payment added!");
    } catch (err) {
      alert("Failed to add payment");
    }
  };

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center">My Earnings</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center mb-8">
            <p className="text-2xl font-medium opacity-90">Total Earnings</p>
            <p className="text-6xl font-bold mt-4">LKR {totalEarnings.toLocaleString()}</p>
            <p className="mt-4 opacity-80">{earnings.length} payments recorded</p>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg"
            >
              {showAddForm ? "Cancel" : "+ Add Payment"}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Record New Payment</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Amount (LKR)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e => setClientName(e.target.value))}
                  className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none"
                />
              </div>
              <button
                onClick={handleAddPayment}
                className="mt-6 w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
              >
                Save Payment
              </button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Payment History</h3>
            {loading ? (
              <p className="text-center py-10 text-gray-500">Loading...</p>
            ) : earnings.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No payments recorded yet</p>
            ) : (
              earnings
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((e, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-5 flex justify-between items-center border border-gray-200">
                    <div>
                      <p className="font-bold text-lg text-gray-800">LKR {e.amount.toLocaleString()}</p>
                      <p className="text-gray-600">{e.clientName}</p>
                      <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString("en-GB")}</p>
                      {e.note && <p className="text-sm text-gray-500 italic">{e.note}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-bold">Received</p>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={onClose}
              className="px-10 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsModal;