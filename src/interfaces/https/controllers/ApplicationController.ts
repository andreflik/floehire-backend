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
import { AppError } from "@/application/errors/AppError";

const service = new ApplicationService();

export class ApplicationController {
  static async apply(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const candidateId = req.user.id;
      const { job_id } = applySchema.parse(req.body);

      const application = await service.apply(candidateId, job_id);
      return res.status(201).json(application);
    } catch (error: any) {
      return handleControllerError(res, error);
    }
  }

  static async listByJob(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const recruiterId = req.user.id;
      const { jobId } = jobIdParamSchema.parse(req.params);

      const applications = await service.listByJob(jobId, recruiterId);
      return res.json(applications);
    } catch (error: any) {
      return handleControllerError(res, error);
    }
  }

  static async move(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const recruiterId = req.user.id;
      const { applicationId } = applicationIdParamSchema.parse(req.params);
      const { toStageId } = moveApplicationSchema.parse(req.body);

      const result = await service.moveStage({
        applicationId,
        toStageId,
        recruiterId,
      });

      return res.json(result);
    } catch (error: any) {
      return handleControllerError(res, error);
    }
  }

  static async listMine(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const candidateId = req.user.id;
      const data = await service.listByCandidate(candidateId);

      return res.json(data);
    } catch (error: any) {
      return handleControllerError(res, error);
    }
  }

  static async evaluate(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

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
      return handleControllerError(res, error);
    }
  }

  static async history(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const recruiterId = req.user.id;
      const { applicationId } = applicationIdParamSchema.parse(req.params);

      const history = await service.getApplicationHistory(
        applicationId,
        recruiterId,
      );

      return res.json(history);
    } catch (error: any) {
      return handleControllerError(res, error);
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const recruiterId = req.user.id;
      const { applicationId } = applicationIdParamSchema.parse(req.params);

      await service.removeApplication(applicationId, recruiterId);

      return res.status(204).send();
    } catch (error: any) {
      return handleControllerError(res, error);
    }
  }
}

/**
 * Handler central de erros do controller
 */
function handleControllerError(res: Response, error: any) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: error.flatten(),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });
  }

  console.error("🔥 CONTROLLER ERROR:", error);

  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
  });
}
