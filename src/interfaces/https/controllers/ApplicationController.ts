import { Request, Response } from "express";
import ApplicationService from "@/application/services/ApplicationService";
import {
  applySchema,
  moveApplicationSchema,
  applicationIdParamSchema,
  evaluateApplicationSchema,
  jobIdParamSchema,
} from "@/application/validators/applicationSchemas";
import { ZodError } from "zod";

const service = new ApplicationService();

export class ApplicationController {
  static async apply(req: Request, res: Response) {
    try {
      const candidateId = req.user!.id;

      const { job_id } = applySchema.parse(req.body);

      const application = await service.apply(candidateId, job_id);
      return res.status(201).json(application);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  static async listByJob(req: Request, res: Response) {
    try {
      const recruiterId = req.user!.id;
      const { jobId } = jobIdParamSchema.parse(req.params);

      const applications = await service.listByJob(jobId, recruiterId);
      return res.json(applications);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  static async move(req: Request, res: Response) {
    try {
      const recruiterId = req.user!.id;

      const { applicationId } = applicationIdParamSchema.parse(req.params);
      const { toStageId } = moveApplicationSchema.parse(req.body);

      const result = await service.moveStage({
        applicationId,
        toStageId,
        recruiterId,
      });

      return res.json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  static async listMine(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }
    const candidateId = req.user.id;

    const data = await service.listByCandidate(candidateId);

    return res.json(data);
  }

  static async evaluate(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const recruiterId = req.user.id;
      const { applicationId } = applicationIdParamSchema.parse(req.params);
      const payload = evaluateApplicationSchema.parse(req.body);

      const result = await service.evaluateApplication({
        applicationId,
        recruiterId,
        ...payload,
      });

      return res.json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      return res
        .status(400)
        .json({ error: error.message || "EVALUATE_APPLICATION_FAILED" });
    }
  }

  static async history(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const recruiterId = req.user.id;
      const { applicationId } = applicationIdParamSchema.parse(req.params);

      const history = await service.getApplicationHistory(
        applicationId,
        recruiterId,
      );

      return res.json(history);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error.message || "GET_HISTORY_FAILED" });
    }
  }
}
