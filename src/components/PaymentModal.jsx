export default function PaymentModal({ open, onClose, hostel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>

        <p className="mb-4 text-gray-700">
          Booking: <span className="font-semibold">{hostel.name}</span>
        </p>

        <div className="space-y-3">
          <button
            onClick={() => alert("Load Stripe Payment")}
            className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Pay with Stripe
          </button>

          <button
            onClick={() => alert("Load M-Pesa Payment")}
            className="w-full border border-gray-300 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Pay with M-Pesa
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 hover:text-black transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
