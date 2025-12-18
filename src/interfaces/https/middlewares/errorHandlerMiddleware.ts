import { Request, Response, NextFunction } from "express";

export function errorHandlerMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("🔥 ERROR:", err);

  if (err instanceof Error) {
    switch (err.message) {
      case "TOKEN_INVALID":
      case "TOKEN_MISSING":
        return res.status(401).json({ error: err.message });

      case "FORBIDDEN":
        return res.status(403).json({ error: err.message });

      case "EMAIL_ALREADY_EXISTS":
      case "EMAIL_NOT_FOUND":
        return res.status(400).json({ error: err.message });

      case "JOB_NOT_FOUND":
        return res.status(404).json({ error: err.message });

      default:
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
}
