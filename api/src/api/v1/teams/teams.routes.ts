import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateCreateTeam } from "./teams.validation.js";
import { createTeamController } from "./teams.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validateCreateTeam, createTeamController);

export default router;
