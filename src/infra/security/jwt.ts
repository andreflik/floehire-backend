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
  console.log("JWT_SECRET (LOGIN):", process.env.JWT_SECRET);
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    throw err;
  }
}
