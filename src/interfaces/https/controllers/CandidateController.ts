import { Request, Response } from "express";
import CandidateService from "@/application/services/CandidateService";
import PrismaCandidateRepository from "@/infra/repositories/PrismaCandidateRepository";
import { RegisterCandidateDTO } from "@/application/dtos/RegisterCandidateDTO";

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
}

export default new CandidateController();
