import { Request, Response } from "express";
import { RecruiterService } from "@/application/services/RecruiterService";
import {
  recruiterRegisterSchema,
  recruiterLoginSchema,
  recruiterRefreshSchema,
} from "@/application/validators/recruiterSchema";
import { asyncHandler } from "@/interfaces/https/utils/asyncHandler";
import { getAuthUser } from "../utils/getAuthUser";

const service = new RecruiterService();

class RecruiterController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const payload = recruiterRegisterSchema.parse(req.body);

    const result = await service.register(payload);
    return res.status(201).json(result);
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const payload = recruiterLoginSchema.parse(req.body);

    const result = await service.login(payload);
    return res.json(result);
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = recruiterRefreshSchema.parse(req.body);

    const result = await service.refresh(refresh_token);
    return res.json(result);
  });

  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const recruiter = await service.getProfile(user.id);
    return res.json(recruiter);
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const recruiter = await service.updateProfile(user.id, req.body);
    return res.json(recruiter);
  });
}

export default RecruiterController;
