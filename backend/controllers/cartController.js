import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Cart mein daalne se pehle double check karen ke product real mein exist karta hai ya nahi!
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ message: "This product no longer exists." });
    }

    let cart = await Cart.findOne({ userId });

    // Agar cart exist nahi karta
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      // Item already exist?
      const item = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item in cart
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Item quantity updated in cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart by userID
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all carts
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({})
      .populate("userId", "name email")
      .populate("items.productId", "title price image");
    res.status(200).json({ success: true, carts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
