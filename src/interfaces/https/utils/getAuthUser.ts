import { Request } from "express";
import { AuthRequest, AuthUser } from "@/types/AuthRequest";

export function getAuthUser(req: Request): AuthUser {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    throw new Error("UNAUTHORIZED");
  }

  return authReq.user;
}
