import express from "express";
import { getRecommendedVolunteers } from "../controllers/matchingController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/needs/:needId/recommendations", getRecommendedVolunteers);

export default router;
