import express from "express";
import { registerNgo, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-ngo", registerNgo);
router.post("/login", login);

export default router;
