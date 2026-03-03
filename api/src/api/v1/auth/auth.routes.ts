import { Router } from "express";
import { googleAuth } from "./auth.controller.js";

const router = Router();

router.get("/google", googleAuth);

export default router;
