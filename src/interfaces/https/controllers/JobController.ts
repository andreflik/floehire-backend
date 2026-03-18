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
import { getAuthUser } from "../utils/getAuthUser";

const service = new JobService();

class JobController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const payload = createJobSchema.parse(req.body);
    const job = await service.create(user.id, payload);

    return res.status(201).json(job);
  });

  static list = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const jobs = await service.listByRecruiter(user.id);
    return res.json(jobs);
  });

  static show = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { id: jobId } = jobIdParamSchema.parse(req.params);
    const job = await service.getById(jobId, user.id);

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
    const user = getAuthUser(req);

    const { id: jobId } = jobIdParamSchema.parse(req.params);
    const payload = updateJobSchema.parse(req.body);

    const job = await service.update(jobId, user.id, payload);
    return res.json(job);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { id: jobId } = jobIdParamSchema.parse(req.params);

    await service.delete(jobId, user.id);
    return res.status(204).send();
  });

  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const { id: jobId } = jobIdParamSchema.parse(req.params);
    const { status } = updateJobStatusSchema.parse(req.body);

    const job = await service.updateStatus(jobId, user.id, status);
    return res.json(job);
  });
}

export default JobController;
