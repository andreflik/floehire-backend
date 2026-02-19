import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/infra/security/jwt";

export function candidateAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "TOKEN_MISSING" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "TOKEN_MALFORMED" });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (decoded.role !== "candidate") {
      return res.status(403).json({ error: "FORBIDDEN" });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({ error: "TOKEN_INVALID" });
  }
}
