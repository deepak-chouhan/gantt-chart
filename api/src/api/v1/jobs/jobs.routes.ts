import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";

const router = Router();
router.use(authenticate);

export default router;
