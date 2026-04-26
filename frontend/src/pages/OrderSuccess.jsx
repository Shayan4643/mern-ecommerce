import { useParams } from "react-router";

export default function OrderSuccess() {
    const { id } = useParams();

    const goHome = () => {
        window.location.href = "/";
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="mb-4">Your order ID is: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{id}</span></p>
            <button onClick={goHome} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">Continue Shopping</button>
        </div>
    )

}


