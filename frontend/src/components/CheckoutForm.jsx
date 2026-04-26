import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function CheckoutForm({ clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      onSuccess(); // Call the parent function to place the order
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-6 rounded-2xl bg-white shadow-md mt-4"
    >
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        Enter Card Details
      </h3>
      <div className="p-4 border border-gray-300 rounded-xl mb-4 bg-gray-50">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && (
        <div className="text-red-500 mb-4 text-sm font-semibold">{error}</div>
      )}
      <button
        disabled={processing || !stripe}
        className="cursor-pointer w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        {processing ? "Processing Payment..." : "Pay Now"}
      </button>
    </form>
  );
}
