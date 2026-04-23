import express from "express";
import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
} from "../controllers/volunteerController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect); // All volunteer routes are protected

router.post("/", createVolunteer);
router.get("/", getAllVolunteers);
router.get("/:id", getVolunteerById);
router.put("/:id", updateVolunteer);

export default router;
