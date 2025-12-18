import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function recruiterAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "TOKEN_MISSING" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret"
    ) as JwtPayload;

    if (decoded.role !== "recruiter") {
      return res.status(403).json({ error: "FORBIDDEN" });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: "recruiter",
    };

    return next();
  } catch {
    return res.status(401).json({ error: "TOKEN_INVALID" });
  }
}
