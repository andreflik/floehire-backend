import { Request, Response } from "express";
import JobService from "@/application/services/JobService";

const service = new JobService();

class JobController {
  async create(req: Request, res: Response) {
    const recruiterId = req.user?.id;
    if (!recruiterId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const job = await service.create(recruiterId, req.body);
    return res.status(201).json(job);
  }

  async list(req: Request, res: Response) {
    const recruiterId = req.user?.id;
    const jobs = await service.listByRecruiter(recruiterId);
    return res.json(jobs);
  }

  async show(req: Request, res: Response) {
    const recruiterId = req.user?.id;
    const job = await service.getById(req.params.id, recruiterId);
    return res.json(job);
  }
}

export default new JobController();
