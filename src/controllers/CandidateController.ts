import { Request, Response } from "express";
import CandidateService from "../services/CandidateService";

class CandidateController {
  async register(req: Request, res: Response) {
    try {
      const candidate = await CandidateService.register(req.body);

      return res.status(201).json(candidate);
    } catch (error: any) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new CandidateController();
