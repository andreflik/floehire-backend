import { Request, Response } from "express";
import CandidateService from "../../../application/services/CandidateService";
import PrismaCandidateRepository from "../../../infra/repositories/PrismaCandidateRepository";
import { RegisterCandidateDTO } from "@/application/dtos/RegisterCandidateDTO";
import { LoginCandidateDTO } from "@/application/dtos/LoginCandidateDTO";
import { ZodError } from "zod";
import {
  registerCandidateSchema,
  loginCandidateSchema,
  forgotPasswordSchema,
} from "@/application/validators/candidateSchemas";
import { resetPasswordSchema } from "@/application/validators/resetPaswordSchema";

const repository = new PrismaCandidateRepository();
const service = new CandidateService(repository);

class CandidateController {
  async register(req: Request, res: Response) {
    try {
      const data = registerCandidateSchema.parse(req.body);

      const result = await service.register(data);

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({ error: "EMAIL_ALREADY_EXISTS" });
      }

      console.error("REGISTER ERROR:", error);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = loginCandidateSchema.parse(req.body);

      const result = await service.login(data);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      if (error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "INVALID_CREDENTIALS" });
      }

      console.error("LOGIN ERROR:", error);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      await service.forgotPassword(email);
      return res.json({ message: "E-mail enviado com instruções." });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          details: error.flatten(),
        });
      }

      if (error.message === "EMAIL_NOT_FOUND") {
        return res.status(404).json({ error: "EMAIL_NOT_FOUND" });
      }

      console.error("FORGOT PASSWORD ERROR:", error);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const data = resetPasswordSchema.parse(req.body);

      await service.resetPassword(data.token, data.newPassword);

      return res.json({ message: "Senha alterada com sucesso!" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new CandidateController();
