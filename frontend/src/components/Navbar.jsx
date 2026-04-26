import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(0);
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        setCart(0);
        return;
      }

      try {
        const res = await api.get(`/cart/${userId}`);
        const items = res.data.cart?.items || [];
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setCart(total);
      } catch {
        setCart(0);
      }
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setCart(0);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  return (
    <nav className="shadow-md bg-linear-to-r from-blue-500 via-yellow-500 to-purple-600 text-white p-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-10">
      <Link
        to="/"
        className="font-bold text-lg sm:text-2xl uppercase cursor-pointer w-auto sm:mr-auto"
      >
        E-Commerce
      </Link>

      {!userId ? (
        <div className="flex gap-2 sm:gap-4 items-center justify-end w-auto">
          <Link
            to="/signup"
            className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-2 rounded-lg sm:text-lg cursor-pointer shadow-md hover:shadow-xl transition duration-500 ease-in-out hover:scale-105 active:scale-95 text-xs"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-2 rounded-lg sm:text-lg cursor-pointer shadow-md hover:shadow-xl transition duration-500 ease-in-out hover:scale-105 active:scale-95 text-xs"
          >
            Login
          </Link>
        </div>
      ) : (
        <>
          {/* Cart and Logout: Always on row 1 (mobile) and far right (desktop) */}
          <div className="flex items-center justify-end gap-4 order-1 sm:order-2">
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg sm:text-sm cursor-pointer shadow-md hover:shadow-xl transition duration-500 ease-in-out hover:scale-105 active:scale-95 text-xs"
            >
              Logout
            </button>
            <Link
              to="/cart"
              className="relative text-2xl hover:scale-110 transition duration-300 ease-in-out cursor-pointer block sm:ml-2"
            >
              <FaShoppingCart />
              {cart > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart}
                </span>
              )}
            </Link>
          </div>

          {/* Admin Buttons: Row 2 on mobile, next to Logout/Cart on desktop */}
          {userEmail === "shayanasif519@gmail.com" && (
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center w-full sm:w-auto order-2 sm:order-1 sm:mr-4">
              <Link
                to="/admin/dashboard"
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-3 rounded-lg sm:text-sm cursor-pointer shadow-md hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/products/add"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg sm:text-sm cursor-pointer shadow-md hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs"
              >
                + Add Product
              </Link>
            </div>
          )}
        </>
      )}
    </nav>
  );
}
