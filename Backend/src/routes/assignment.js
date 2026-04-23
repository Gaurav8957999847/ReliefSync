import express from "express";
import {
  createAssignment,
  getAllAssignments,
  updateAssignmentStatus,
} from "../controllers/assignmentController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createAssignment);
router.get("/", getAllAssignments);
router.put("/:id/status", updateAssignmentStatus);

export default router;
