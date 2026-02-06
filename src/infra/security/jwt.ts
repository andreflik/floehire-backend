import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export type JwtRole = "candidate" | "recruiter";

export interface JwtPayload {
  sub: string;
  role: JwtRole;
  email: string;
}

export function signAccessToken(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "15m",
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
