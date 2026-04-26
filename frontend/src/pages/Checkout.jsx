import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe("pk_test_51TQD9JCcn2WGhoVjuhv7mEHRg3fSyK9Tk7GVJljeTYQATPMsW4yp61IRZYZamrJkjjVEkpFEd3NqPUorKQ1wnYPi007HetMgKH");

export default function Checkout() {
    const userId = localStorage.getItem("userId");
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [clientSecret, setClientSecret] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadCheckoutData = async () => {
            try {
                if (!userId) {
                    setCart({ items: [] });
                    setAddress([]);
                    navigate("/login");
                    return;
                }

                const [cartRes, addressRes] = await Promise.all([
                    api.get(`/cart/${userId}`),
                    api.get(`/address/${userId}`)
                ]);

                setCart(cartRes.data.cart || { items: [] });
                setAddress(addressRes.data.addresses);
                setSelectedAddress(addressRes.data.addresses[0]?._id || null);
            } catch (error) {
                console.error("Error loading checkout data:", error);
                setCart({ items: [] });
                setAddress([]);
            } finally {
                setLoading(false);
            }
        };
        loadCheckoutData();
    }, [userId, navigate]);

    useEffect(() => {
        const hasItems = cart && cart.items && cart.items.length > 0;
        if (paymentMethod === "Card" && !clientSecret && hasItems) {
            api.post("/payment/create-intent", { userId })
               .then(res => setClientSecret(res.data.clientSecret))
               .catch(err => console.error("Stripe error:", err));
        }
    }, [paymentMethod, userId, clientSecret, cart]);

    if (loading) return <div>Loading...</div>;

    const total = (cart.items || []).reduce(
        (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
        0
    );

    const placeOrder = async (method = paymentMethod) => {
        try {
            if (!selectedAddress) {
                alert("Please select an address before placing the order.");
                return;
            }

            const selectedAddrObj = address.find(
                (addr) => addr._id === selectedAddress
            );

            const res = await api.post("/order/place-order", {
                userId,
                address: selectedAddrObj,
                paymentMethod: method,
            });

            navigate(`/order-success/${res.data.order._id}`);

        } catch (error) {
            console.error("Order error:", error);
        }
    };

    const deleteAddress = async (id) => {
        try {
            if (!confirm("Are you sure you want to delete this address?")) {
                return;
            }

            await api.delete(`/address/${id}`);

            // UI update
            const updated = address.filter((addr) => addr._id !== id);
            setAddress(updated);

            // agar deleted address selected tha to reset
            if (selectedAddress === id) {
                setSelectedAddress(updated[0]?._id || null);
            }

        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold">Checkout</h1>

                <Link
                    to="/checkout-address"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full sm:w-auto text-center"
                >
                    + Add New Address
                </Link>
            </div>
            <h2 className="font-semibold mb-2">Select Address</h2>
            {address.length === 0 ? (
                <p className="mb-4 text-gray-600">No address found. Please add an address first.</p>
            ) : (
                address.map((addr) => (
                    <div key={addr._id} className="relative border mb-2 p-3 rounded">

                        {/* ❌ DELETE BUTTON */}
                        <button
                            onClick={() => deleteAddress(addr._id)}
                            className="absolute top-2 right-2 text-red-500 font-bold cursor-pointer hover:text-red-700"
                        >
                            ✕
                        </button>

                        <label className="block cursor-pointer">
                            <input
                                type="radio"
                                name="address"
                                value={addr._id}
                                checked={selectedAddress === addr._id}
                                onChange={() => setSelectedAddress(addr._id)}
                            />

                            <span className="ml-2">{addr.fullName}</span>
                            <span className="ml-6">{addr.phone}</span>

                            <p>
                                {addr.addressLine}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}
                            </p>
                        </label>
                    </div>
                ))
            )}
            <h2 className="font-semibold mt-6 mb-3 text-lg">Payment Method</h2>
            <div className="flex gap-6 mb-6 p-4 border rounded-xl bg-gray-50">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="COD" 
                        checked={paymentMethod === "COD"} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        className="w-4 h-4 text-blue-600"
                    />
                    Cash on Delivery
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Card" 
                        checked={paymentMethod === "Card"} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        className="w-4 h-4 text-blue-600"
                    />
                    Pay with Card
                </label>
            </div>

            <div className="border-t pt-4 mt-4">
                <h2 className="font-semibold mb-2 text-lg">Order Summary</h2>
                <p className="text-2xl font-bold text-gray-800 mb-6">Total: ${total.toFixed(2)}</p>

                {paymentMethod === "COD" ? (
                    <button 
                        onClick={() => placeOrder("COD")} 
                        className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-4 mt-2 rounded-xl font-bold text-lg cursor-pointer hover:opacity-90 shadow-md transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Place Order (Cash on Delivery)
                    </button>
                ) : (
                    clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm clientSecret={clientSecret} onSuccess={() => placeOrder("Card")} />
                        </Elements>
                    ) : (
                        <div className="text-center p-4 text-gray-500">Loading secure payment gateway...</div>
                    )
                )}
            </div>
        </div>
    );
}
