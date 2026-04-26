import express from "express";
import { saveAddress, getAddresses, deleteAddress } from "../controllers/addressController.js";

const router = express.Router();

router.post("/add", saveAddress);
router.get("/:userId", getAddresses);
router.delete("/:id", deleteAddress);

export default router;
