import { Request, Response } from "express";
import CandidateAuthService from "@/application/services/CandidateAuthService";

class CandidateAuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios" });
      }

      const result = await CandidateAuthService.login(email, password);

      return res.json(result);
    } catch (err: any) {
      console.error("Erro no login:", err);

      if (err.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new CandidateAuthController();
