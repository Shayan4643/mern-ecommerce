import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlCategory = searchParams.get("category");

    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        let url = `/products?search=${search}`;
        if (category !== "all") {
          url += `&category=${category}`;
        }

        const res = await api.get(url);
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      loadProducts();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, category]);

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search Products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded cursor-pointer w-full sm:w-auto"
        >
          <option className="cursor-pointer" value="all">
            All
          </option>
          <option className="cursor-pointer" value="Mobile">
            Mobiles
          </option>
          <option className="cursor-pointer" value="Laptop">
            Laptops
          </option>
          <option className="cursor-pointer" value="Electronics">
            Electronics
          </option>
          <option className="cursor-pointer" value="Shoes">
            Shoes
          </option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 text-center mt-6">
        {loading ? (
          <p className="text-center col-span-full"> Loading... </p>
        ) : products.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No products found
          </p>
        ) : (
          products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white group"
            >
              <img
                src={
                  product.image?.startsWith("/uploads")
                    ? `http://localhost:5000${product.image}`
                    : product.image
                }
                alt={product.title}
                className="w-full h-48 mx-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col flex-grow mt-4">
                <h2 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2" title={product.title}>
                  {product.title}
                </h2>
                <p className="text-gray-600 font-semibold mb-4">
                  Rs. {product.price.toLocaleString()}
                </p>
                <button className="w-full mt-auto bg-blue-500 text-white py-2.5 px-4 rounded-xl font-bold hover:bg-blue-600 cursor-pointer shadow-md active:scale-95 transition-all">
                  See more details
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
