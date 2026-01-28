import { Request, Response } from "express";
import JobService from "@/application/services/JobService";

const service = new JobService();

class JobController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const recruiterId = req.user.id;
      const job = await service.create(recruiterId, req.body);

      return res.status(201).json(job);
    } catch (error) {
      console.error("🔥 ERRO AO CRIAR VAGA:", error);
      return res.status(400).json({
        error: "CREATE_JOB_FAILED",
        details: String(error),
      });
    }
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

  static async listPublic(req: Request, res: Response) {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      service.listPublic({ skip, take: limit }),
      service.countPublic(),
    ]);

    return res.json({
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  static async publicList(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      service.listPublic({ skip, take: limit }),
      service.countPublic(),
    ]);

    return res.json({
      data: jobs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  }

  static async showPublic(req: Request, res: Response) {
    const job = await service.getPublicById(req.params.id);
    return res.json(job);
  }
}

export default JobController;
