import express from "express";
import {
  createWarden,
  getAllWardens,
  getWardenByIdOrName,
  updateWarden,
  deleteWarden,
  getMe,
  getMyHostels,
  getMyResidents,
  updateMyProfile,
  updateWardenPassword,
} from "../controllers/wardenController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= WARDEN DASHBOARD ROUTES ================= */
router.get("/me", protect, authorizeRoles("warden"), getMe);
router.put("/me", protect, authorizeRoles("warden"), updateMyProfile);
router.get("/my-hostels", protect, authorizeRoles("warden"), getMyHostels);
router.get("/my-residents", protect, authorizeRoles("warden"), getMyResidents);

/* ================= ADMIN ROUTES ================= */
router.get("/", protect, authorizeRoles("admin"), getAllWardens);
router.post("/", protect, authorizeRoles("admin"), createWarden);
router.get("/:idOrName", protect, authorizeRoles("admin"), getWardenByIdOrName); // get by ID or name
router.put("/:id", protect, authorizeRoles("admin"), updateWarden);
router.delete("/:id", protect, authorizeRoles("admin"), deleteWarden);

// Admin: Update Warden Password
router.put("/:id/password", protect, authorizeRoles("admin"), updateWardenPassword);

export default router;
