import express from "express";
import { generateSummary } from "../controllers/summaryController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/generate", generateSummary);

export default router;
