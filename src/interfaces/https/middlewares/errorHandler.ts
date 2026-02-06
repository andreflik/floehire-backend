import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "@/application/errors/AppError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: err.flatten(),
    });
  }

  // Erros de domínio (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
  }

  // Log para debug
  console.error("💥 UNHANDLED ERROR:", err);

  // Fallback
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Erro interno no servidor",
  });
}
