import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Link } from "react-router";

export default function ProductList() {

    const [products, setProducts] = useState([]);

    const loadProducts = useCallback(async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data.products);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/delete/${id}`);
            loadProducts();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            await loadProducts();
        };
        fetchProducts();
    }, [loadProducts]);

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">

            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold">Products</h2>
                <Link to="/admin/products/add" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add New Product
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border text-center whitespace-nowrap">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id} className="border-t">
                                <td className="p-3">{p.title}</td>
                                <td className="p-3">Rs {p.price}</td>
                                <td className="p-3">{p.stock}</td>
                                <td className="p-3 space-x-2">
                                    <Link
                                        to={`/admin/products/edit/${p._id}`} // ✅ FIX
                                        className="text-blue-500 mr-3"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => deleteProduct(p._id)}
                                        className="text-red-500 ml-3 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

