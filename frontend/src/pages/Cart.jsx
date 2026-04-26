import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    try {
      if (!userId) {
        setCart({ items: [] });
        return;
      }

      const response = await api.get(`/cart/${userId}`);
      setCart(response.data.cart || { items: [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [] });
    }
  }, [userId]);

  useEffect(() => {
    const fetchCart = async () => {
      await loadCart();
    };
    fetchCart();
  }, [loadCart]);

  const removeItem = async (productId) => {
    try {
      await api.post(`/cart/remove`, { userId, productId });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      await api.post(`/cart/update`, { userId, productId, quantity });

      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (!cart) {
    return <div className="p-6">Loading cart...</div>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.items
            .filter((item) => item.productId !== null)
            .map((item) => (
              <div
                key={item.productId._id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded gap-4"
              >
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full sm:w-1/2 text-center sm:text-left">
                  <img
                    src={
                      item.productId.image?.startsWith("/uploads")
                        ? `http://localhost:5000${item.productId.image}`
                        : item.productId.image
                    }
                    alt={item.productId.title}
                    className="w-24 h-24 sm:w-20 sm:h-20 object-contain mb-2 sm:mb-0"
                  />

                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.productId.title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {item.productId.description}
                    </p>
                  </div>
                </div>

                <span className="text-xl font-bold w-full sm:w-auto text-center sm:text-left">
                  Total: {(item.productId.price * item.quantity).toFixed(2)}
                </span>

                <div className="flex items-center justify-center space-x-4 w-full sm:w-auto">
                  <button
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg cursor-pointer font-bold text-xl hover:bg-gray-600 shadow"
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span className="font-semibold text-lg">{item.quantity}</span>

                  <button
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg cursor-pointer font-bold text-xl hover:bg-gray-600 shadow"
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className="mt-6 text-right">
        <span className="text-xl font-bold">Total: {total.toFixed(2)}</span>
      </div>
      <button
        onClick={() => navigate("/checkout-address")}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 cursor-pointer"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
