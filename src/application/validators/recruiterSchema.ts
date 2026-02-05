import { z } from "zod";

export const recruiterRegisterSchema = z.object({
  company_name: z.string().min(2, "company_name é obrigatório"),
  email: z.string().email("email inválido").toLowerCase(),
  password: z.string().min(6, "senha deve ter no mínimo 6 caracteres"),
});

export const recruiterLoginSchema = z.object({
  email: z.string().email("email inválido").toLowerCase(),
  password: z.string().min(6, "senha deve ter no mínimo 6 caracteres"),
});
