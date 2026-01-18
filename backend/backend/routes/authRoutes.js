// routes/authRoutes.js
import express from "express";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Single route supports both GET (fetch) and PUT (update)
router.route("/me").get(protect, me).put(protect, me);

export default router;
