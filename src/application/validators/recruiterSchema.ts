import { z } from "zod";

export const recruiterRegisterSchema = z.object({
  company_name: z.string().min(2, "Nome da empresa é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const recruiterLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const recruiterRefreshSchema = z.object({
  refresh_token: z.string().uuid("Refresh token inválido"),
});

export type RecruiterRegisterInput = z.infer<typeof recruiterRegisterSchema>;
export type RecruiterLoginInput = z.infer<typeof recruiterLoginSchema>;
export type RecruiterRefreshInput = z.infer<typeof recruiterRefreshSchema>;
