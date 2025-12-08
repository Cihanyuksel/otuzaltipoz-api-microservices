import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Bu ${field} değeri zaten kullanımda. Lütfen başka bir değer seçin.`;
    err = new AppError(message, 409);
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Hatalı veri girişi: ${errors.join(". ")}`;
    err = new AppError(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new AppError("Geçersiz token. Lütfen tekrar giriş yapın.", 401);
  }

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
