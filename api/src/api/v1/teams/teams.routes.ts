import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import {
  validateCreateTeam,
  validateInviteMember,
  validateMemberParam,
  validateTeamIdParam,
  validateUpdateTeam,
} from "./teams.validation.js";
import {
  createTeamController,
  deleteTeamController,
  getMyTeamController,
  getTeamController,
  inviteMemberController,
  leaveTeamController,
  removeMemberController,
  updateTeamController,
} from "./teams.controller.js";

import { validateCreateProject } from "../projects/projects.validation.js";
import {
  createProjectController,
  getAllTeamProjectsController,
} from "../projects/projects.controller.js";

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
router.delete("/:teamId", validateTeamIdParam, deleteTeamController);

router.delete("/:teamId/members/me", validateTeamIdParam, leaveTeamController);
router.post(
  "/:teamId/members",
  validateTeamIdParam,
  validateInviteMember,
  inviteMemberController,
);
router.delete(
  "/:teamId/members/:userId",
  validateTeamIdParam,
  validateMemberParam,
  removeMemberController,
);

// Project route scoped to team
router.post(
  "/:teamId/projects",
  validateTeamIdParam,
  validateCreateProject,
  createProjectController,
);
router.get(
  "/:teamId/projects",
  validateTeamIdParam,
  getAllTeamProjectsController,
);

export default router;
