import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "user" | "admin" | "moderator";
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError("Giriş yapmanız gerekiyor.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: "user" | "admin" | "moderator";
    };

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return next(new AppError("Geçersiz veya süresi dolmuş oturum.", 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Bu işlemi yapmak için yetkiniz yok.", 403));
    }
    next();
  };
};
