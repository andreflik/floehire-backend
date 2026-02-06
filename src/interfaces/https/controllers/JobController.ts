import { Request, Response } from "express";
import JobService from "@/application/services/JobService";
import {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
  listPublicQuerySchema,
  jobIdParamSchema,
} from "@/application/validators/jobSchemas";
import { asyncHandler } from "@/interfaces/https/utils/asyncHandler";

const service = new JobService();

class JobController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const payload = createJobSchema.parse(req.body);

    const job = await service.create(recruiterId, payload);
    return res.status(201).json(job);
  });

  static list = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const jobs = await service.listByRecruiter(recruiterId);
    return res.json(jobs);
  });

  static show = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { id: jobId } = jobIdParamSchema.parse(req.params);

    const job = await service.getById(jobId, recruiterId);
    return res.json(job);
  });

  static listPublic = asyncHandler(async (req: Request, res: Response) => {
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
  });

  static showPublic = asyncHandler(async (req: Request, res: Response) => {
    const { id: jobId } = jobIdParamSchema.parse(req.params);

    const job = await service.getPublicById(jobId);
    return res.json(job);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { id: jobId } = jobIdParamSchema.parse(req.params);
    const payload = updateJobSchema.parse(req.body);

    const job = await service.update(jobId, recruiterId, payload);
    return res.json(job);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { id: jobId } = jobIdParamSchema.parse(req.params);

    await service.delete(jobId, recruiterId);
    return res.status(204).send();
  });

  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { id: jobId } = jobIdParamSchema.parse(req.params);
    const { status } = updateJobStatusSchema.parse(req.body);

    const job = await service.updateStatus(jobId, recruiterId, status);
    return res.json(job);
  });
}

export default JobController;
