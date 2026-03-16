import { z } from "zod";

export const experienceSchema = z.object({
  job_title: z.string().min(1).optional(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(), // YYYY-MM
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable()
    .optional(),
  responsibilities: z.string().min(1).optional(),
});

export const registerCandidateSchema = z.object({
  full_name: z.string().min(3, "full_name must have at least 3 characters"),
  email: z.string().email("invalid email"),
  password: z.string().min(6, "password must have at least 6 characters"),

  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),

  linkedin_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  portfolio_url: z.string().url().optional(),

  escolaridade: z.string().optional(),
  curso: z.string().optional(),
  instituicao: z.string().optional(),
  ano_conclusao: z.string().optional(),
  certificacoes: z.string().optional(),
  idiomas: z.string().optional(),

  portfolio_file: z.any().optional(),
  portfolio_link: z.string().url().optional().nullable().or(z.literal("")),

  lgpd_consent: z.boolean().refine((v) => v === true, {
    message: "lgpd_consent must be true",
  }),

  experiences: z.array(experienceSchema).optional(),
});

export const loginCandidateSchema = z.object({
  email: z.string().email("invalid email"),
  password: z.string().min(1, "password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().uuid("Token inválido"),
  newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const candidateRefreshSchema = z.object({
  refresh_token: z.string().uuid("Refresh token inválido"),
});
