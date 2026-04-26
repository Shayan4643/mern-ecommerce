import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import {
  FaTruck,
  FaShieldAlt,
  FaShippingFast,
  FaHeadset,
} from "react-icons/fa";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get("/products?isFeatured=true");
        // Get the first 4 featured products or all if less than 4
        setFeaturedProducts(response.data.products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first to add items to cart.");
      return;
    }

    try {
      const res = await api.post("/cart/add", {
        userId,
        productId,
      });

      alert(res.data?.message || "Item added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  return (
    <div className="p-6">
      {/* HERO */}
      <div
        className="lg:h-150 md:h-137.5 h-112.5 w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/assets/hero-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="lg:text-5xl sm:text-3xl text-2xl font-bold">
            Welcome to Our Store
          </h1>
          <p className="lg:text-lg sm:text-md text-md mt-2">
            Discover the best products at the lowest prices
          </p>

          <Link
            to="/products"
            className="bg-yellow-500 text-white py-2 px-4 rounded mt-4 font-bold sm:text-lg text-md shadow-md hover:bg-yellow-600 hover:shadow-xl transition hover:scale-105 active:scale-95"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="flex flex-col items-center px-4">
        <h2 className="h-20 text-center mt-8 font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-linear-to-r from-blue-500 via-yellow-500 to-purple-600 bg-clip-text text-transparent">
          Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
          {[
            { name: "Mobiles", img: "/assets/fp1.jpg", cat: "Mobile" },
            { name: "Laptops", img: "/assets/fp2.jpg", cat: "Laptop" },
            { name: "Electronics", img: "/assets/fp3.jpg", cat: "Electronics" },
            { name: "Shoes", img: "/assets/fp4.jpg", cat: "Shoes" },
          ].map((item, index) => (
            <Link
              key={index}
              to={`/products?category=${item.cat}`}
              className="border p-6 pb-12 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-40 object-cover rounded-xl"
              />
              <p className="font-bold text-center text-2xl mt-3">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="flex flex-col items-center px-4 mt-10">
        <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-linear-to-r from-blue-500 via-yellow-500 to-purple-600 bg-clip-text text-transparent">
          Featured Products
        </h2>

        {loading ? (
          <p className="mt-10 text-xl font-bold text-gray-500 text-center">
            Loading featured products...
          </p>
        ) : featuredProducts.length === 0 ? (
          <p className="mt-10 text-xl font-bold text-gray-500 text-center">
            No featured products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10 w-full max-w-6xl">
            {featuredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="border p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white"
              >
                <Link to={`/product/${product._id || product.id}`}>
                  <img
                    src={
                      product.image?.startsWith("/uploads")
                        ? `http://localhost:5000${product.image}`
                        : product.image
                    }
                    alt={product.title}
                    className="w-48 h-48 mx-auto object-contain rounded-xl"
                  />
                  <p
                    className="font-bold text-center text-lg mt-3 truncate px-2"
                    title={product.title}
                  >
                    {product.title}
                  </p>
                  <p className="font-bold text-center text-xl text-blue-600 mt-1">
                    Rs {product.price}
                  </p>
                </Link>

                <button
                  onClick={() => handleAddToCart(product._id || product.id)}
                  className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 font-bold shadow-md hover:shadow-xl transition hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="flex flex-col items-center px-4 mt-10">
        <h2 className="h-20 text-center font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-linear-to-r from-blue-500 via-yellow-500 to-purple-600 bg-clip-text text-transparent">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
          <div className="border p-6 rounded-3xl h-48 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white">
            <FaTruck className="text-5xl text-blue-500 mb-4" />
            <h3 className="font-bold text-lg text-gray-800">Free Delivery</h3>
          </div>
          <div className="border p-6 rounded-3xl h-48 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white">
            <FaShieldAlt className="text-5xl text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg text-gray-800">Secure Payment</h3>
          </div>
          <div className="border p-6 rounded-3xl h-48 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white">
            <FaShippingFast className="text-5xl text-purple-600 mb-4" />
            <h3 className="font-bold text-lg text-gray-800">Fast Delivery</h3>
          </div>
          <div className="border p-6 rounded-3xl h-48 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white">
            <FaHeadset className="text-5xl text-green-500 mb-4" />
            <h3 className="font-bold text-lg text-gray-800">
              24/7 Customer Support
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
