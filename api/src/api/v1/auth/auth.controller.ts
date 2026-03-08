import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { googleClient } from "../../../config/googleClient.js";
import { env } from "../../../config/env.js";
import { ErrorCode, HttpStatus } from "../../../types/error.types.js";
import { pool } from "../../../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../../utils/jwt.js";
import ApiResponse from "../../../utils/apiResponse.js";
import AppError from "../../../utils/appError.js";

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
          refreshToken,
        },
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.UNAUTHORIZED, "Google authentication failed"),
    );
  }
};

export const refreshAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError(ErrorCode.UNAUTHORIZED, "No refresh token"));
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload?.id) {
      return next(
        new AppError(ErrorCode.UNAUTHORIZED, "Invalid token payload"),
      );
    }

    const hashedToken = hashToken(refreshToken);
    const storedTokens = await pool.query(
      "SELECT expires_at FROM refresh_tokens WHERE user_id = $1 AND token_hash = $2",
      [payload.id, hashedToken],
    );

    if (!storedTokens.rows[0]) {
      return next(
        new AppError(ErrorCode.UNAUTHORIZED, "Invalid refresh token"),
      );
    }

    if (new Date(storedTokens.rows[0].expires_at) < new Date()) {
      return next(
        new AppError(ErrorCode.UNAUTHORIZED, "Refresh token expired"),
      );
    }

    const existingUser = await pool.query(
      "SELECT id, email, name, avatar_url, google_id FROM users WHERE id = $1 LIMIT 1",
      [payload.id],
    );

    const user = existingUser.rows[0];
    if (!user) {
      return next(new AppError(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const newHashedToken = hashToken(newRefreshToken);

    await pool.query(
      "UPDATE refresh_tokens SET token_hash = $1, expires_at = NOW() + '7 days' WHERE user_id = $2",
      [newHashedToken, user.id],
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.node_env === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Token refreshed successfully",
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      }),
    );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new AppError(ErrorCode.UNAUTHORIZED, "Refresh token expired"),
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new AppError(ErrorCode.UNAUTHORIZED, "Invalid refresh token"),
      );
    }

    return next(
      new AppError(ErrorCode.UNAUTHORIZED, "Invalid or expired refresh token"),
    );
  }
};

export const logoutAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        if (!payload?.id) {
          return next(
            new AppError(ErrorCode.UNAUTHORIZED, "Invalid token payload"),
          );
        }

        await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [
          payload.id,
        ]);
      } catch {
        return next(
          new AppError(ErrorCode.UNAUTHORIZED, "Token invalid or expired"),
        );
      }
    } else {
      return next(new AppError(ErrorCode.UNAUTHORIZED, "No refresh token"));
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.node_env === "production",
      sameSite: "strict",
    });

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "User successfully logged out",
      }),
    );
  } catch {
    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const meAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, avatar_url FROM users WHERE id = $1 LIMIT 1",
      [req.user.id],
    );

    if (!rows[0]) {
      return next(new AppError(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
    }

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "User retrieved successfully.",
        data: { user: rows[0] },
      }),
    );
  } catch {
    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};
