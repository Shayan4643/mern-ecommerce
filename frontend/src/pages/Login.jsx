import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      // Save Token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userEmail", res.data.user.email);

      setMsg(res.data.message);

      // Redirect to Homepage after 1 second (full reload to update Navbar)
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 px-4 py-12">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold bg-linear-to-r from-blue-500 via-yellow-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-500">Please sign in to your account</p>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
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
             <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
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
            className="w-full py-4 mt-4 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account? <a href="/signup" className="text-blue-600 font-bold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
