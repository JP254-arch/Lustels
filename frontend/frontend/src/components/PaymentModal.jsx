import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMoneyBillWave,
  faCreditCard,
  faWallet,
  faTimes,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

// -------------------- CONFIG --------------------
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
    return rawMonths > 0 ? rawMonths : 1; // At least 1 month
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
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInKES, hostelName: hostel.name }),
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) alert(result.error.message);
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
      await handleStripePayment(paidNow);
    } else {
      if (onConfirm) onConfirm(bookingData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg animate-slide-in">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faWallet} /> Book {hostel.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarAlt} /> Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarAlt} /> Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* MONTHS */}
        <div className="mb-4">
          <input
            readOnly
            value={`Months: ${months}`}
            className="border p-2 rounded w-full bg-gray-100 font-semibold text-center"
          />
        </div>

        {/* PAYMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Deposit
            </label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="border p-2 rounded w-full"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Amount to Pay Now
            </label>
            <input
              type="number"
              value={amountToPay}
              onChange={(e) => setAmountToPay(Number(e.target.value))}
              className="border p-2 rounded w-full"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faCreditCard} /> Payment Method
            </label>
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

        {/* SUMMARY */}
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

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 flex items-center justify-center gap-1"
          >
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-orange-900 text-white hover:bg-orange-700 flex items-center justify-center gap-1"
          >
            {loading ? "Processing..." : <> <FontAwesomeIcon icon={faCheckCircle} /> Confirm & Pay</>}
          </button>
        </div>
      </div>
    </div>
  );
}
