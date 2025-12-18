import { Request, Response } from "express";
import ApplicationService from "@/application/services/ApplicationService";

const service = new ApplicationService();

export class ApplicationController {
  static async apply(req: Request, res: Response) {
    const candidateId = req.user!.id;
    const { job_id } = req.body;

    const application = await service.apply(candidateId, job_id);
    return res.status(201).json(application);
  }

  static async listByJob(req: Request, res: Response) {
    const recruiterId = req.user!.id;
    const { jobId } = req.params;

    const applications = await service.listByJob(jobId, recruiterId);
    return res.json(applications);
  }
}
