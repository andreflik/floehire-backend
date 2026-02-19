import { z } from "zod";

export const updateCandidateProfileSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  portfolio_url: z.string().nullable().optional(),

  education: z
    .array(
      z.object({
        escolaridade: z.string().optional(),
        curso: z.string().optional(),
        instituicao: z.string().optional(),
        ano_conclusao: z.string().optional(),
        certificacoes: z.string().optional(),
        idiomas: z.string().optional(),
      }),
    )
    .optional(),

  experiences: z
    .array(
      z.object({
        company: z.string().optional().nullable(),
        job_title: z.string().optional(),
        responsibilities: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
      }),
    )
    .optional(),
});
