import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

// -------------------- CONFIG --------------------
// Replace this with your Stripe public key
const stripePromise = loadStripe("pk_test_YourPublicKeyHere"); 

const paymentMethods = ["Mpesa", "Card"];

export default function BookingModal({ hostel, onClose, onConfirm }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [amountToPay, setAmountToPay] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [months, setMonths] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateTotals();
  }, [checkIn, checkOut, deposit, amountToPay]);

  // -------------------- CALCULATION --------------------
  const calculateMonths = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const rawMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1;
    return rawMonths > 0 ? rawMonths : 1; // Always at least 1 month
  };

  const calculateTotals = () => {
    const m = calculateMonths();
    setMonths(m);
    const total = m * Number(hostel.price || 0);
    setTotalAmount(total);
    const paid = Number(deposit || 0) + Number(amountToPay || 0);
    setBalance(total - paid);
  };

  // -------------------- STRIPE PAYMENT --------------------
  const handleStripePayment = async (amountInKES) => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      // Call your backend to create a Stripe session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInKES, // amount in KES, backend will convert to cents/USD
          hostelName: hostel.name,
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (err) {
      console.error("Stripe payment error:", err);
      alert("Payment failed. Try again.");
    }
    setLoading(false);
  };

  // -------------------- CONFIRM BOOKING --------------------
  const handleConfirm = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    const paidNow = Number(deposit || 0) + Number(amountToPay || 0);
    if (paidNow > totalAmount) {
      alert("Paid amount cannot exceed total amount.");
      return;
    }

    const bookingData = {
      fullName: "", // fill from user profile
      hostel: hostel.name,
      roomType: hostel.roomType,
      bedsPerRoom: hostel.bedsPerRoom,
      price: hostel.price,
      assignedWarden: hostel.assignedWarden,
      totalRooms: hostel.totalRooms,
      checkIn,
      checkOut,
      monthlyRent: hostel.price,
      deposit: Number(deposit),
      amountPaid: Number(amountToPay),
      months,
      totalAmount,
      balance,
      paymentMethod,
      status: "active",
    };

    if (paymentMethod === "Card") {
      // Stripe payment flow
      await handleStripePayment(paidNow);
    } else {
      // Mpesa or other method: confirm directly
      if (onConfirm) onConfirm(bookingData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Book {hostel.name}</h2>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">Check-In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Check-Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Months */}
        <div className="mb-4">
          <input
            readOnly
            value={`Months: ${months}`}
            className="border p-2 rounded w-full bg-gray-100 font-semibold text-center"
          />
        </div>

        {/* Payments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">Deposit</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="border p-2 rounded w-full"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Amount to Pay Now</label>
            <input
              type="number"
              value={amountToPay}
              onChange={(e) => setAmountToPay(Number(e.target.value))}
              className="border p-2 rounded w-full"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm space-y-1">
          <p>
            <strong>Total Amount:</strong> KES {totalAmount.toLocaleString()}
          </p>
          <p>
            <strong>Paid (Deposit + Now):</strong> KES {(deposit + amountToPay).toLocaleString()}
          </p>
          <p>
            <strong>Balance:</strong>{" "}
            <span
              className={
                balance > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"
              }
            >
              KES {balance.toLocaleString()}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-orange-900 text-white hover:bg-orange-700"
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}
