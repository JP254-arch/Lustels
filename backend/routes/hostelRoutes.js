// routes/hostelRoutes.js
import express from "express";
import {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
} from "../controllers/hostelController.js";

const router = express.Router();

/* ================= GET ALL ================= */
router.get("/", getAllHostels);

/* ================= GET ONE ================= */
router.get("/:id", getHostelById);

/* ================= CREATE ================= */
router.post("/", createHostel);

/* ================= UPDATE ================= */
router.put("/:id", updateHostel);

/* ================= DELETE ================= */
router.delete("/:id", deleteHostel);

export default router;
