import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateProjectIdParam } from "./projects.validation.js";
import {
  deleteProjectByIdController,
  getProjectByIdController,
  updateProjectByIdController,
} from "./projects.controller.js";

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

export default router;
