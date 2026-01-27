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
    try {
      const jobs = await service.listPublic();
      return res.json(jobs);
    } catch (error) {
      console.error("🔥 ERRO AO LISTAR VAGAS PÚBLICAS:", error);
      return res.status(500).json({
        error: "LIST_PUBLIC_JOBS_FAILED",
      });
    }
  }
}

export default JobController;
