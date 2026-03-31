import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import {
  validateCreateProject,
  validateProjectIdParam,
} from "./projects.validation.js";
import {
  createProjectController,
  deleteProjectByIdController,
  getProjectByIdController,
  updateProjectByIdController,
} from "./projects.controller.js";
import { getTasksByProjectController } from "../tasks/tasks.controller.js";

const router = Router();

router.use(authenticate);

router.get("/:projectId", validateProjectIdParam, getProjectByIdController);
router.patch(
  "/:projectId",
  validateProjectIdParam,
  updateProjectByIdController,
);
router.delete(
  "/:projectId",
  validateProjectIdParam,
  deleteProjectByIdController,
);

// Tasks route scoped to team
router.post(
  "/:projectId/tasks",
  validateProjectIdParam,
  validateCreateProject,
  createProjectController,
);
router.get(
  "/:projectId/tasks",
  validateProjectIdParam,
  getTasksByProjectController,
);

export default router;
