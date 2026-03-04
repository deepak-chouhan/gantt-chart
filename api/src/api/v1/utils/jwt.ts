import jwt from "jsonwebtoken";
import { IUser } from "../../../types/user.types.js";
import { env } from "../../../config/env.js";
import { createHash } from "node:crypto";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret);
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: "7d" });
};

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
