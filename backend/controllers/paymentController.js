import Stripe from "stripe";
import Cart from "../models/cart.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      if (!item.productId) return sum;
      return sum + item.productId.price * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
      currency: "usd",
      metadata: { userId },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
