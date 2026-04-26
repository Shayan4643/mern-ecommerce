import { useState, useEffect } from "react";
import api from "../api/axios";
import { useParams } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [msg, setMsg] = useState("");
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("/products");
        const p = res.data.products.find((item) => item._id === id);

        if (p) {
          setProduct(p);
        } else {
          setNotFoundError(true);
        }
      } catch {
        setNotFoundError(true);
      }
    };
    loadProducts();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMsg("Please login first to add items to cart.");
      return;
    }

    try {
      const res = await api.post("/cart/add", {
        userId,
        productId: product._id,
      });

      setMsg(res.data.message || "Item added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  if (notFoundError) {
    return (
      <div className="p-6 text-2xl text-center text-red-500 font-bold">
        Product not found! Dastiyaab nahi hai.
      </div>
    );
  }
  if (!product) {
    return <div className="p-6 text-center text-xl">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start">
      <img
        src={
          product.image?.startsWith("/uploads")
            ? `http://localhost:5000${product.image}`
            : product.image
        }
        alt={product.title}
        className="w-full md:w-1/2 h-64 object-contain bg-white rounded-xl shadow-md p-4"
      />
      <div className="w-full md:w-1/2 flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-bold mt-4 md:mt-0 text-gray-800">{product.title}</h1>
        <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">{product.description}</p>
        <p className="text-2xl font-bold mt-6 text-blue-600">Rs. {product.price.toLocaleString()}</p>
        {msg && (
          <p
            className={`mt-4 text-sm font-bold p-3 rounded-md ${
              msg.toLowerCase().includes("added") ||
              msg.toLowerCase().includes("login")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </p>
        )}

        <button
          onClick={handleAddToCart}
          className="mt-6 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
