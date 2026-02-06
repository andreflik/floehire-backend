import { z } from "zod";
import {
  job_contract_type,
  job_work_model,
  job_hire_type,
  job_status,
} from "@prisma/client";

const salarySchema = z
  .object({
    salary_min: z.number().int().nonnegative().nullable().optional(),
    salary_max: z.number().int().nonnegative().nullable().optional(),
  })
  .refine(
    (data) =>
      data.salary_min == null ||
      data.salary_max == null ||
      data.salary_min <= data.salary_max,
    {
      message: "salary_min cannot be greater than salary_max",
      path: ["salary_min"],
    },
  );

export const createJobSchema = z
  .object({
    title: z.string().min(3, "title must have at least 3 characters"),
    description: z.string().nullable().optional(),

    seniority: z.string().nullable().optional(),
    contract_type: z.nativeEnum(job_contract_type).nullable().optional(),
    work_model: z.nativeEnum(job_work_model).nullable().optional(),

    hire_type: z.nativeEnum(job_hire_type).nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().length(2).nullable().optional(),

    salary_min: z.number().int().nonnegative().nullable().optional(),
    salary_max: z.number().int().nonnegative().nullable().optional(),

    deadline: z.string().datetime().nullable().optional(),
  })
  .and(salarySchema);

export const updateJobSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().nullable().optional(),

    seniority: z.string().nullable().optional(),
    contract_type: z.nativeEnum(job_contract_type).nullable().optional(),
    work_model: z.nativeEnum(job_work_model).nullable().optional(),

    hire_type: z.nativeEnum(job_hire_type).nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().length(2).nullable().optional(),

    salary_min: z.number().int().nonnegative().nullable().optional(),
    salary_max: z.number().int().nonnegative().nullable().optional(),

    deadline: z.string().datetime().nullable().optional(),
  })
  .and(salarySchema)
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export const updateJobStatusSchema = z.object({
  status: z.nativeEnum(job_status),
});

export const listPublicQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const jobIdParamSchema = z.object({
  id: z.string().uuid("Invalid job id"),
});
