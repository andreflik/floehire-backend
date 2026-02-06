import { Request, Response } from "express";
import PipelineService from "@/application/services/PipelineService";
import {
  jobIdParamSchema,
  applicationIdParamSchema,
  moveCandidateBodySchema,
} from "@/application/validators/pipelineSchemas";
import { asyncHandler } from "@/interfaces/https/utils/asyncHandler";

const service = new PipelineService();

export class PipelineController {
  static getJobPipeline = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { jobId } = jobIdParamSchema.parse(req.params);

    const pipeline = await service.getPipelineByJob(jobId, recruiterId);
    return res.json(pipeline);
  });

  static move = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { applicationId } = applicationIdParamSchema.parse(req.params);
    const { toStageId } = moveCandidateBodySchema.parse(req.body);

    const result = await service.moveCandidate(
      applicationId,
      toStageId,
      recruiterId,
    );

    return res.json(result);
  });
}
