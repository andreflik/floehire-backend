import { Request, Response } from "express";
import ApplicationService from "@/application/services/ApplicationService";
import {
  applySchema,
  moveApplicationSchema,
  applicationIdParamSchema,
  evaluateApplicationSchema,
  jobIdParamSchema,
} from "@/application/validators/applicationSchemas";
import { asyncHandler } from "@/interfaces/https/utils/asyncHandler";
import { getAuthUser } from "../utils/getAuthUser";

const service = new ApplicationService();

export class ApplicationController {
  static apply = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { job_id } = applySchema.parse(req.body);

    const application = await service.apply(user.id, job_id);
    return res.status(201).json(application);
  });

  static listByJob = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { jobId } = jobIdParamSchema.parse(req.params);

    const applications = await service.listByJob(jobId, user.id);
    return res.json(applications);
  });

  static move = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { applicationId } = applicationIdParamSchema.parse(req.params);
    const { toStageId } = moveApplicationSchema.parse(req.body);

    const result = await service.moveStage({
      applicationId,
      toStageId,
      recruiterId: user.id,
    });

    return res.json(result);
  });

  static listMine = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const data = await service.listByCandidate(user.id);
    return res.json(data);
  });

  static evaluate = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { applicationId } = applicationIdParamSchema.parse(req.params);
    const payload = evaluateApplicationSchema.parse(req.body);

    const result = await service.evaluateApplication({
      applicationId,
      recruiterId: user.id,
      ...payload,
    });

    return res.json(result);
  });

  static history = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { applicationId } = applicationIdParamSchema.parse(req.params);

    const history = await service.getApplicationHistory(applicationId, user.id);

    return res.json(history);
  });

  static historyMine = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const data = await service.listHistoryByCandidate(user.id);
    return res.json(data);
  });

  static remove = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { applicationId } = applicationIdParamSchema.parse(req.params);

    await service.removeApplication(applicationId, user.id);
    return res.status(204).send();
  });
}
