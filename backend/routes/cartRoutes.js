import express from "express";

import {
  addToCart,
  removeItem,
  updateQuantity,
  getCart,
  getAllCarts,
} from "../controllers/cartController.js";

const router = express.Router()

router.get("/all", getAllCarts);
router.post("/add", addToCart);
router.post("/remove", removeItem);
router.post("/update", updateQuantity);
router.get("/:userId", getCart);

export default router;

