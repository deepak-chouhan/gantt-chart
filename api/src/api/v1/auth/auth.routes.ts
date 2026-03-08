import { Router } from "express";
import {
  googleAuth,
  logoutAuth,
  meAuth,
  refreshAuth,
} from "./auth.controller.js";
import { authenticate } from "../../../middleware/authenticate.js";

const router = Router();

router.post("/google", googleAuth);
router.post("/refresh", refreshAuth);
router.post("/logout", logoutAuth);
router.get("/me", authenticate, meAuth);

export default router;
