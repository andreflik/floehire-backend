import { Request, Response } from "express";
import JobService from "@/application/services/JobService";
import { UpdateJobStatusDTO } from "@/application/dtos/UpdateJobStatusDTO";
import {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
  listPublicQuerySchema,
  jobIdParamSchema,
} from "@/application/validators/jobSchemas";
import { ZodError } from "zod";

const service = new JobService();

class JobController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const recruiterId = req.user.id;

      const payload = createJobSchema.parse(req.body);

      const job = await service.create(recruiterId, payload);
      return res.status(201).json(job);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      console.error("🔥 ERRO AO CRIAR VAGA:", error);
      return res
        .status(400)
        .json({ error: error.message || "CREATE_JOB_FAILED" });
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
    try {
      if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const recruiterId = req.user.id;
      const { id: jobId } = jobIdParamSchema.parse(req.params);

      const job = await service.getById(jobId, recruiterId);
      return res.json(job);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      console.error("ERRO AO BUSCAR VAGA:", error);
      return res.status(400).json({ error: error.message || "GET_JOB_FAILED" });
    }
  }

  static async listPublic(req: Request, res: Response) {
    try {
      const { page, limit } = listPublicQuerySchema.parse(req.query);

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
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      console.error("ERRO AO LISTAR VAGAS PÚBLICAS:", error);
      return res.status(500).json({ error: "LIST_PUBLIC_FAILED" });
    }
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
    try {
      const { id: jobId } = jobIdParamSchema.parse(req.params);

      const job = await service.getPublicById(jobId);
      return res.json(job);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      console.error("ERRO AO BUSCAR VAGA PÚBLICA:", error);
      return res
        .status(400)
        .json({ error: error.message || "GET_PUBLIC_JOB_FAILED" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const recruiterId = req.user.id;
      const { id: jobId } = jobIdParamSchema.parse(req.params);

      const payload = updateJobSchema.parse(req.body);

      const job = await service.update(jobId, recruiterId, payload);
      return res.json(job);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      console.error("ERRO AO ATUALIZAR VAGA:", error);
      return res
        .status(400)
        .json({ error: error.message || "UPDATE_JOB_FAILED" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const recruiterId = req.user.id;
      const { id: jobId } = jobIdParamSchema.parse(req.params);

      await service.delete(jobId, recruiterId);
      return res.status(204).send();
    } catch (error: any) {
      console.error("ERRO AO EXCLUIR VAGA:", error);
      return res
        .status(400)
        .json({ error: error.message || "DELETE_JOB_FAILED" });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const recruiterId = req.user.id;
      const { id: jobId } = jobIdParamSchema.parse(req.params);

      const { status } = updateJobStatusSchema.parse(req.body);

      const job = await service.updateStatus(jobId, recruiterId, status);
      return res.json(job);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      console.error("ERRO AO ATUALIZAR STATUS:", error);
      return res
        .status(400)
        .json({ error: error.message || "UPDATE_STATUS_FAILED" });
    }
  }
}

export default JobController;
