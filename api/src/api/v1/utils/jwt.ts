import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../../../types/user.types.js";
import { env } from "../../../config/env.js";
import { createHash } from "node:crypto";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user.id }, env.jwt.accessSecret, { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user.id }, env.jwt.refreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
};

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
