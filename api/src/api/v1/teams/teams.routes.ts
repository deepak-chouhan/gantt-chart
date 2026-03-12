import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateCreateTeam } from "./teams.validation.js";
import {
  createTeamController,
  getMyTeamController,
  getTeamController,
} from "./teams.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validateCreateTeam, createTeamController);
router.get("/", getMyTeamController);
router.get("/:teamId", getTeamController);

export default router;
