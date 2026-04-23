import express from "express";
import {
  getOverview,
  getCriticalNeeds,
  getActiveAssignments,
  getVolunteerStats,
} from "../controllers/dashboardController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/overview", getOverview);
router.get("/critical-needs", getCriticalNeeds);
router.get("/active-assignments", getActiveAssignments);
router.get("/volunteer-stats", getVolunteerStats);

export default router;
