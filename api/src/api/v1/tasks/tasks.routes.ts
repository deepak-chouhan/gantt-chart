import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateTaskIdParam } from "./tasks.validation.js";

const router = Router();

router.use(authenticate);

router.get("/:taskId", validateTaskIdParam);

export default router;
