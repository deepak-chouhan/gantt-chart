import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import {
  validateCreateTeam,
  validateTeamIdParam,
  validateUpdateTeam,
} from "./teams.validation.js";
import {
  createTeamController,
  getMyTeamController,
  getTeamController,
  updateTeamController,
} from "./teams.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validateCreateTeam, createTeamController);
router.get("/", getMyTeamController);
router.get("/:teamId", validateTeamIdParam, getTeamController);
router.patch(
  "/:teamId",
  validateTeamIdParam,
  validateUpdateTeam,
  updateTeamController,
);

export default router;
