import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(
        new AppError("Giriş yapmanız gerekiyor (Token bulunamadı).", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new AppError("Bu tokena sahip kullanıcı artık mevcut değil.", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return next(
      new AppError("Geçersiz token, lütfen tekrar giriş yapın.", 401)
    );
  }
};
