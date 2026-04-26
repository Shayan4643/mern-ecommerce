import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes, cartsRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/order/all"),
        api.get("/cart/all"),
      ]);

      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      if (cartsRes.data.success) setCarts(cartsRes.data.carts);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/order/${id}`);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting order");
    }
  };

  const deleteAllOrders = async () => {
    if (
      !window.confirm(
        "WARNING: Are you sure you want to clear ALL orders? This action cannot be undone!",
      )
    )
      return;
    try {
      await api.delete("/order/all");
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Error clearing orders");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-xl">Loading Dashboard...</div>;
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const totalItemsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
    0,
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Analytics Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-4xl font-bold mt-2">{users.length}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-4xl font-bold mt-2">{orders.length}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Items Sold</h2>
          <p className="text-4xl font-bold mt-2">{totalItemsSold}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-4xl font-bold mt-2">
            Rs. {totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold">Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Active Cart Items</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userCart = carts.find((c) => c.userId?._id === user._id);
                const cartItemsCount = userCart
                  ? userCart.items.reduce((s, i) => s + i.quantity, 0)
                  : 0;
                return (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-500">{user._id}</td>
                    <td className="p-3 font-semibold">{user.name}</td>
                    <td className="p-3 text-gray-700">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${cartItemsCount > 0 ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}
                      >
                        {cartItemsCount} items
                      </span>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-gray-500 font-bold"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold">All Orders</h2>
          {orders.length > 0 && (
            <button
              onClick={deleteAllOrders}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow font-semibold flex items-center gap-2"
            >
              <FaTrash /> Clear All Orders
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items Ordered</th>
                <th className="p-3">Total Bill</th>
                <th className="p-3">Address</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-500">{order._id}</td>
                  <td className="p-3">
                    <p className="font-semibold">
                      {order.userId?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.userId?.email || "N/A"}
                    </p>
                  </td>
                  <td className="p-3">
                    <ul className="list-disc list-inside text-sm">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.productId?.title || "Deleted Product"}{" "}
                          <span className="font-bold">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 font-bold text-blue-600">
                    Rs. {order.totalAmount}
                  </td>
                  <td className="p-3 text-xs text-gray-600 max-w-xs">
                    <p className="font-semibold">{order.address?.fullName}</p>
                    <p>
                      {order.address?.addressLine}, {order.address?.city}
                    </p>
                    <p>{order.address?.phone}</p>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="text-red-500 hover:text-red-700 font-bold p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete Order"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500 font-bold"
                  >
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
