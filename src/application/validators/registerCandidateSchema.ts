import { z } from "zod";

export const experienceSchema = z.object({
  job_title: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  responsibilities: z.string().optional(),
});

export const registerCandidateSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  lgpd_consent: z.boolean(),

  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  linkedin_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  portfolio_url: z.string().url().optional(),

  escolaridade: z.string().optional(),
  curso: z.string().optional(),
  instituicao: z.string().optional(),
  ano_conclusao: z.string().optional(),
  certificacoes: z.string().optional(),
  idiomas: z.string().optional(),

  experiences: z.array(experienceSchema).optional(),
});

export type RegisterCandidateDTO = z.infer<typeof registerCandidateSchema>;
