import Product from "../models/product.js";

// Create
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.image = req.file.path; // Cloudinary assigns the full URL to path
    }
    // Convert string boolean to actual boolean
    if (productData.isFeatured === "true") {
      productData.isFeatured = true;
    } else {
      productData.isFeatured = false;
    }

    const newProduct = await Product.create(productData);
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read
export const getProducts = async (req, res) => {
  try {
    const { search, category, isFeatured } = req.query;

    let filter = {};

    // 🔍 Search by title (case-insensitive)
    if (search && search.trim() !== "") {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // 📦 Filter by category
    if (category && category !== "all") {
      filter.category = category;
    }

    // 🌟 Filter by featured
    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Product updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
