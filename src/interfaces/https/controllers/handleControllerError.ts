import { Response } from "express";
import { ZodError } from "zod";
import { AppError } from "@/application/errors/AppError";

export function handleControllerError(res: Response, error: any) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: error.flatten(),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });
  }

  console.error("UNHANDLED ERROR:", error);
  return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
}
