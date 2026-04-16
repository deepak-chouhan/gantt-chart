import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateProjectIdParam } from "./projects.validation.js";
import {
  deleteProjectByIdController,
  getProjectByIdController,
  updateProjectByIdController,
} from "./projects.controller.js";
import {
  createTaskController,
  getTasksByProjectController,
} from "../tasks/tasks.controller.js";
import { validateCreateTask } from "../tasks/tasks.validation.js";

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
  validateCreateTask,
  createTaskController,
);
router.get(
  "/:projectId/tasks",
  validateProjectIdParam,
  getTasksByProjectController,
);

export default router;
