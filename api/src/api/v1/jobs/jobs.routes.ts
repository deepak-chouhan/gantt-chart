import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateProjectIdParam } from "../projects/projects.validation.js";
import { validateJobIdParam } from "./jobs.validation.js";
import {
  exportController,
  getJobController,
  importController,
} from "./jobs.controller.js";

const router = Router();
router.use(authenticate);

router.post(
  "/projects/:projectId/export",
  validateProjectIdParam,
  exportController,
);
router.post(
  "/projects/:projectId/import",
  validateProjectIdParam,
  importController,
);

router.post("/:jobId", validateJobIdParam, getJobController);

export default router;
