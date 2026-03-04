import { Router } from "express";
import { googleAuth } from "./auth.controller.js";

const router = Router();

router.post("/google", googleAuth);

export default router;
