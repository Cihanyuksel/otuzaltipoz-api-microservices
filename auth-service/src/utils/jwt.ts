import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

export const generateTokens = (userId: Types.ObjectId | string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const isProduction = process.env.NODE_ENV !== "development";

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // JS okuyamaz
    secure: isProduction, // Sadece HTTPS (Prod)
    sameSite: "strict", // CSRF koruması
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
