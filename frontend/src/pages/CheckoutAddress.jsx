import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function CheckoutAddress() {
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
    try {
      await api.post("/address/add", { ...form, userId });
      navigate("/checkout");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={form[key]}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
      ))}
      <button
        onClick={saveAddress}
        className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600"
      >
        Save Address
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <Link
        to="/checkout"
        className="text-blue-500 hover:underline text-center block mt-4"
      >
        I want to select from existing addresses
      </Link>
    </div>
  );
}
