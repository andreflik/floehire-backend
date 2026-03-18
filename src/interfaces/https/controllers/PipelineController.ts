import { Request, Response } from "express";
import PipelineService from "@/application/services/PipelineService";
import {
  jobIdParamSchema,
  applicationIdParamSchema,
  moveCandidateBodySchema,
} from "@/application/validators/pipelineSchemas";
import { asyncHandler } from "@/interfaces/https/utils/asyncHandler";
import { getAuthUser } from "../utils/getAuthUser";

const service = new PipelineService();

export class PipelineController {
  static getJobPipeline = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { jobId } = jobIdParamSchema.parse(req.params);

    const pipeline = await service.getPipelineByJob(jobId, user.id);
    return res.json(pipeline);
  });

  static move = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { applicationId } = applicationIdParamSchema.parse(req.params);
    const { toStageId } = moveCandidateBodySchema.parse(req.body);

    const result = await service.moveCandidate(
      applicationId,
      toStageId,
      user.id,
    );

    return res.json(result);
  });
}
