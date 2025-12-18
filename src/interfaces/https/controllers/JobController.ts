import { Request, Response } from "express";
import JobService from "@/application/services/JobService";

const service = new JobService();

class JobController {
  static async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;

    const job = await service.create(recruiterId, req.body);
    return res.status(201).json(job);
  }

  static async list(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;

    const jobs = await service.listByRecruiter(recruiterId);
    return res.json(jobs);
  }

  static async show(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;

    const job = await service.getById(req.params.id, recruiterId);
    return res.json(job);
  }
}

export default JobController;
