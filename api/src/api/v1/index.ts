import { Router } from "express";
import authRouter from "./auth/auth.routes.js";
import teamsRouter from "./teams/teams.routes.js";
import projectsRouter from "./projects/projects.route.js";

const V1Router = Router();

V1Router.use("/auth", authRouter);
V1Router.use("/teams", teamsRouter);
V1Router.use("/projects", projectsRouter);

export default V1Router;
