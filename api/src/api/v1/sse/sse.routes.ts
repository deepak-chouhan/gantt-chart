import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateProjectIdParam } from "../projects/projects.validation.js";
import { sseEventController } from "./sse.controller.js";

const router = Router();

router.use(authenticate);

router.get("/:projectId", validateProjectIdParam, sseEventController);

export default router;
