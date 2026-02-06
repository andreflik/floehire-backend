import { Request, Response } from "express";
import CandidateService from "../../../application/services/CandidateService";
import PrismaCandidateRepository from "../../../infra/repositories/PrismaCandidateRepository";
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
    const data = registerCandidateSchema.parse(req.body);

    const result = await service.register(data);

    return res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const data = loginCandidateSchema.parse(req.body);

    const result = await service.login(data);

    return res.status(200).json(result);
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = forgotPasswordSchema.parse(req.body);

    await service.forgotPassword(email);

    return res.json({ message: "E-mail enviado com instruções." });
  }

  async resetPassword(req: Request, res: Response) {
    const data = resetPasswordSchema.parse(req.body);

    await service.resetPassword(data.token, data.newPassword);

    return res.json({ message: "Senha alterada com sucesso!" });
  }
}

export default new CandidateController();
