import { NextFunction, Request, Response } from "express";
import { googleClient } from "../../../config/googleClient.js";
import { env } from "../../../config/env.js";
import { ErrorCode, HttpStatus } from "../../../types/error.types.js";
import { pool } from "../../../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/jwt.js";
import ApiResponse from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.auth.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return next(
        new AppError(
          ErrorCode.UNAUTHORIZED,
          "Unable to retrieve Google account information",
        ),
      );
    }

    const { sub: googleId, email, name, picture } = payload;

    // Find Existing User
    const existingUser = await pool.query(
      "SELECT id, email, name, avatar_url, google_id FROM users WHERE google_id = $1 OR email = $2 LIMIT 1",
      [googleId, email],
    );

    let user = existingUser.rows[0];

    // Create user if not exists
    if (!user) {
      const newUser = await pool.query(
        "INSERT INTO users (google_id, email, name, avatar_url, provider) VALUES ($1, $2, $3, $4, 'google') RETURNING id, email, name, avatar_url, google_id",
        [googleId, email, name, picture],
      );

      user = newUser.rows[0];
    } else if (!user.google_id) {
      // Link Google account if user exist with same email
      await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [
        googleId,
        user.id,
      ]);
    }

    // Generate Access Token and Refresh Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = hashToken(refreshToken);

    await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [
      user.id,
    ]);
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
      [user.id, hashedRefreshToken],
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.node_env === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Authentication successful",
        data: {
          user,
          accessToken,
        },
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      return next(new AppError(ErrorCode.UNAUTHORIZED, error.message));
    }

    return next(
      new AppError(ErrorCode.UNAUTHORIZED, "Google authentication failed"),
    );
  }
};
