import { Request } from "express";

export interface AuthUser {
  id: string;
  email: string;
  role: "recruiter" | "candidate";
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
