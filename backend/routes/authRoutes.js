import express from "express";
import { signupUser, loginUser, getAllUsers } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);

export default router;


