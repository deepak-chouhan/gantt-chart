import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateTaskIdParam } from "./tasks.validation.js";
import {
  deleteTaskController,
  getTaskByIdController,
  updateTaskController,
} from "./tasks.controller.js";

const router = Router();

router.use(authenticate);

router.get("/:taskId", validateTaskIdParam, getTaskByIdController);
router.patch("/:taskId", validateTaskIdParam, updateTaskController);
router.delete("/:taskId", validateTaskIdParam, deleteTaskController);

export default router;
