// 📁 backend/routes/payments.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// CARD ONLY: Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { hostelId, hostelName, amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    // Stripe max limit: 999,999 KES (or 99999999 cents)
    if (amount > 99999900) {
      return res.status(400).json({
        message: "Stripe card payments cannot exceed KES 999,999",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // card only
      line_items: [
        {
          price_data: {
            currency: "kes",
            product_data: {
              name: hostelName,
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/hostels/${hostelId}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Payment could not be initiated" });
  }
});

export default router;
