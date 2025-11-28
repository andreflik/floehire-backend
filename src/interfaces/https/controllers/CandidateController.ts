import { Request, Response } from "express";
import CandidateService from "@/application/services/CandidateService";
import PrismaCandidateRepository from "@/infra/repositories/PrismaCandidateRepository";
import { RegisterCandidateDTO } from "@/application/dtos/RegisterCandidateDTO";

const repository = new PrismaCandidateRepository();
const service = new CandidateService(repository);

class CandidateController {
  async register(req: Request, res: Response) {
    try {
      const data: RegisterCandidateDTO = req.body;

      const result = await service.register(data);

      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({
          error: "Email já cadastrado",
        });
      }

      console.error("CandidateController error:", error);

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

export default new CandidateController();
