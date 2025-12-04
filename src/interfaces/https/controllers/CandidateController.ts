import { Request, Response } from "express";
import CandidateService from "../../../application/services/CandidateService";
import PrismaCandidateRepository from "../../../infra/repositories/PrismaCandidateRepository";
import { RegisterCandidateDTO } from "@/application/dtos/RegisterCandidateDTO";
import { LoginCandidateDTO } from "@/application/dtos/LoginCandidateDTO";

const repository = new PrismaCandidateRepository();
const service = new CandidateService(repository);

class CandidateController {
  async register(req: Request, res: Response) {
    console.log("🔥 [CONTROLLER] Chegou requisição:", req.body);

    try {
      const data: RegisterCandidateDTO = req.body;

      const result = await service.register(data);

      console.log("🎉 [CONTROLLER] Cadastro realizado:", result);

      return res.status(201).json(result);
    } catch (error: any) {
      console.error("💥 [CONTROLLER] ERRO:", error);

      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data: LoginCandidateDTO = req.body;

      const result = await service.login(data);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      console.error("LOGIN ERROR:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      await service.forgotPassword(req.body.email);
      return res.json({ message: "E-mail enviado com instruções." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await service.resetPassword(token, newPassword);

      return res.json({ message: "Senha alterada com sucesso!" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new CandidateController();
