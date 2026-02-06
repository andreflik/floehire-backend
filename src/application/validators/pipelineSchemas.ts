import { z } from "zod";

export const jobIdParamSchema = z.object({
  jobId: z.string().uuid(),
});

export const applicationIdParamSchema = z.object({
  applicationId: z.string().uuid(),
});

export const moveCandidateBodySchema = z.object({
  toStageId: z.string().uuid(),
});
