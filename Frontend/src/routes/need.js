import express from "express";
import { getAllNeeds, getNeedById } from "../controllers/needController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllNeeds);
router.get("/:id", getNeedById);

export default router;
