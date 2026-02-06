import { Request, Response } from "express";
import PipelineService from "@/application/services/PipelineService";
import { ZodError } from "zod";
import {
  jobIdParamSchema,
  applicationIdParamSchema,
  moveCandidateBodySchema,
} from "@/application/validators/pipelineSchemas";

const service = new PipelineService();

export class PipelineController {
  static async getJobPipeline(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const recruiterId = req.user.id;
      const { jobId } = jobIdParamSchema.parse(req.params);

      const pipeline = await service.getPipelineByJob(jobId, recruiterId);
      return res.json(pipeline);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      if (error.message === "JOB_NOT_FOUND") {
        return res.status(404).json({ error: "JOB_NOT_FOUND" });
      }

      console.error(error);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  static async moveCandidate(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const { applicationId, targetStageId } = req.body;
    const recruiterId = req.user.id;

    if (!applicationId || !targetStageId) {
      return res.status(400).json({ error: "INVALID_PAYLOAD" });
    }

    await service.moveCandidate(applicationId, targetStageId, recruiterId);

    return res.status(204).send();
  }

  static async move(req: Request, res: Response) {
    try {
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
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      if (error.message === "APPLICATION_NOT_FOUND") {
        return res.status(404).json({ error: "APPLICATION_NOT_FOUND" });
      }

      if (error.message === "TARGET_STAGE_NOT_FOUND") {
        return res.status(404).json({ error: "TARGET_STAGE_NOT_FOUND" });
      }

      console.error("Pipeline move error:", error);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
}
