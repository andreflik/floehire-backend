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

const service = new ApplicationService();

export class ApplicationController {
  static apply = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = req.user!.id;
    const { job_id } = applySchema.parse(req.body);

    const application = await service.apply(candidateId, job_id);
    return res.status(201).json(application);
  });

  static listByJob = asyncHandler(async (req: Request, res: Response) => {
    const recruiterId = req.user!.id;
    const { jobId } = jobIdParamSchema.parse(req.params);

    const applications = await service.listByJob(jobId, recruiterId);
    return res.json(applications);
  });

  static move = asyncHandler(async (req: Request, res: Response) => {
    const recruiterId = req.user!.id;

    const { applicationId } = applicationIdParamSchema.parse(req.params);
    const { toStageId } = moveApplicationSchema.parse(req.body);

    const result = await service.moveStage({
      applicationId,
      toStageId,
      recruiterId,
    });

    return res.json(result);
  });

  static listMine = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = req.user!.id;
    const data = await service.listByCandidate(candidateId);
    return res.json(data);
  });

  static evaluate = asyncHandler(async (req: Request, res: Response) => {
    const recruiterId = req.user!.id;
    const { applicationId } = applicationIdParamSchema.parse(req.params);
    const payload = evaluateApplicationSchema.parse(req.body);

    const result = await service.evaluateApplication({
      applicationId,
      recruiterId,
      ...payload,
    });

    return res.json(result);
  });

  static history = asyncHandler(async (req: Request, res: Response) => {
    const recruiterId = req.user!.id;
    const { applicationId } = applicationIdParamSchema.parse(req.params);

    const history = await service.getApplicationHistory(
      applicationId,
      recruiterId,
    );
    return res.json(history);
  });

  static historyMine = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = req.user!.id;
    const data = await service.listHistoryByCandidate(candidateId);
    return res.json(data);
  });

  static remove = asyncHandler(async (req: Request, res: Response) => {
    const recruiterId = req.user!.id;
    const { applicationId } = applicationIdParamSchema.parse(req.params);

    await service.removeApplication(applicationId, recruiterId);
    return res.status(204).send();
  });
}
