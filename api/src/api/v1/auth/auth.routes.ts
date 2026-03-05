import { Router } from "express";
import { googleAuth, refreshAuth } from "./auth.controller.js";

const router = Router();

router.post("/google", googleAuth);
router.post("/refresh", refreshAuth)

export default router;
