import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
    });

    const fields = ["title", "description", "price", "category", "image", "stock"];

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setForm(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        loadProduct();
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/update/${id}`, {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
            });

            navigate("/admin/products");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                {fields.map((key) => (
                    <input
                        key={key}
                        name={key}
                        type={key === "price" || key === "stock" ? "number" : "text"}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={key}
                        className="w-full p-2 border rounded"
                    />
                ))}

                <button className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer">
                    Update Product
                </button>
            </form>
        </div>
    );
}

