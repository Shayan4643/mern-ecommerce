import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setMsg("Please fill all the fields");
      return;
    }

    if (form.name.length < 6) {
      setMsg("Name must be at least 6 characters long");
      return;
    }

    if (form.name.length > 15) {
      setMsg("Name must be less than 15 characters long");
      return;
    }

    if (!/^[a-zA-Z0-9_]*$/.test(form.name)) {
      setMsg("Name must contain only letters, numbers, and underscores");
      return;
    }

    if (form.password.length < 6) {
      setMsg("Password must be at least 6 characters long");
      return;
    }

    if (form.password.length > 15) {
      setMsg("Password must be less than 15 characters long");
      return;
    }

    try {
      const response = await api.post("/auth/signup", form);

      setMsg(response.data.message);

      if (response.data.success) {
        setMsg(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 px-4 py-12">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold bg-linear-to-r from-blue-500 via-yellow-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-gray-500">Join us to start shopping</p>
        </div>

        {msg && (
          <div
            className={`mb-6 p-4 rounded-xl text-center text-sm font-bold ${
              msg.toLowerCase().includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
