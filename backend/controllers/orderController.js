import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Place an order
export const placeOrder = async (req, res) => {
  try {
    const { userId, address, paymentMethod } = req.body;

    if (!userId || !address) {
      return res
        .status(400)
        .json({ message: "userId and address are required" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Pehle jin products ka record delete ho chuka hai unko alag kar lein
    const validItems = cart.items.filter((item) => item.productId !== null);

    if (validItems.length === 0) {
      return res.status(400).json({
        message: "Your cart contains only unavailable/deleted products.",
      });
    }

    // Ab sirf valid items ka index banayenge
    const orderItems = validItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );

    for (const item of cart.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId._id, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    const order = new Order({
      userId,
      items: orderItems,
      address,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
    });

    await order.save();
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .populate("items.productId", "title price image");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete single order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear all orders
export const deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json({ success: true, message: "All orders cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
