import jwt from "jsonwebtoken";
import { IUser } from "../../../types/user.types.js";
import { env } from "../config/env.js";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret);
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: "7d" });
};
