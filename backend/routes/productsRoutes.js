import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
