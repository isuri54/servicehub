import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatModal = ({ isOpen, onClose, provider, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && provider) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, provider]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/chat/${provider._id}`,
        {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/chat", {
        providerId: provider._id,
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-5/6 flex flex-col">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={provider.profileImage || "/user.png"} alt="" className="w-12 h-12 rounded-full border-4 border-white" />
            <div>
              <h3 className="text-xl font-bold">{provider.name}</h3>
              <p className="text-green-100">{provider.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500">Start the conversation!</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-5 py-3 rounded-2xl ${
                    msg.sender === "client"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-5 py-3 border-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
          />
          <button
            onClick={sendMessage}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;