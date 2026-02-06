import { z } from "zod";

export const applySchema = z.object({
  job_id: z.string().uuid(),
});

export const moveApplicationSchema = z.object({
  toStageId: z.string().uuid(),
});

export const applicationIdParamSchema = z.object({
  applicationId: z.string().uuid(),
});

export const jobIdParamSchema = z.object({
  jobId: z.string().uuid(),
});
