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

export const evaluateApplicationSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    notes: z.string().max(2000).nullable().optional(),
  })
  .refine((data) => data.rating !== undefined || data.notes !== undefined, {
    message: "At least rating or notes must be provided",
  });
