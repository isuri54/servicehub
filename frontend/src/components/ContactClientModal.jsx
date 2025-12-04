import React from "react";

const ContactClientModal = ({ isOpen, onClose, client }) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative animate-in fade-in slide-in-from-bottom-10 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full border-4 border-green-100 flex items-center justify-center mb-6">
            <img
              src={client.profileImage || "/user.png"}
              alt={client.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{client.name}</h2>
          <p className="text-gray-600 mb-8">Contact Information</p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-center gap-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-2xl font-bold text-green-700">
                  {client.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg"
              >
                Call Now
              </a>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactClientModal;