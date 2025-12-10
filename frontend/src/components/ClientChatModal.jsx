import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ClientChatModal = ({ isOpen, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/chat/client/conversations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data.conversations || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openChat = async (providerId, providerName, providerImage) => {
    setSelectedProvider({ providerId, providerName, providerImage });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/chat/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProvider) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/chat", {
        providerId: selectedProvider.providerId,
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage("");
      openChat(selectedProvider.providerId, selectedProvider.providerName, selectedProvider.providerImage);
    } catch (err) {
      alert("Failed to send");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-5/6 flex flex-col">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-6 text-white flex justify-between items-center">
          <h2 className="text-3xl font-bold">My Messages</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-700">Your Chats</h3>
            </div>
            {loading ? (
              <p className="text-center text-gray-500 py-10">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No messages yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.providerId}
                  onClick={() => openChat(conv.providerId, conv.providerName, conv.providerImage)}
                  className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white transition ${selectedProvider?.providerId === conv.providerId ? "bg-white border-l-4 border-green-600" : ""}`}
                >
                  <img
                    src={conv.providerImage || "/user.png"}
                    alt={conv.providerName}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{conv.providerName}</p>
                    <p className="text-sm text-gray-600 truncate w-48">{conv.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex-1 flex flex-col">
            {selectedProvider ? (
              <>
                <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center gap-4">
                  <img src={selectedProvider.providerImage || "/user.png"} alt="" className="w-10 h-10 rounded-full" />
                  <h3 className="font-bold text-gray-800">{selectedProvider.providerName}</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-500">Start the conversation!</p>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
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
                    className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-green-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition shadow-lg"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p className="text-xl">Select a provider to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientChatModal;