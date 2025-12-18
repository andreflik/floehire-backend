import { Request, Response } from "express";
import { RecruiterService } from "@/application/services/RecruiterService";

const service = new RecruiterService();

class RecruiterController {
  async register(req: Request, res: Response) {
    try {
      const result = await service.register(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      if (err.message === "RECRUITER_ALREADY_EXISTS") {
        return res.status(409).json({ message: "Empresa já cadastrada" });
      }

      return res.status(500).json({ message: "Erro interno" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await service.login(req.body);
      return res.json(result);
    } catch (err: any) {
      if (err.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      return res.status(500).json({ message: "Erro interno" });
    }
  }
}

export default new RecruiterController();
