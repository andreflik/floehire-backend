import { Request, Response } from "express";
import CandidateService from "../../../application/services/CandidateService";
import PrismaCandidateRepository from "../../../infra/repositories/PrismaCandidateRepository";
import {
  registerCandidateSchema,
  loginCandidateSchema,
  forgotPasswordSchema,
  candidateRefreshSchema,
} from "@/application/validators/candidateSchemas";
import { resetPasswordSchema } from "@/application/validators/resetPaswordSchema";
import { asyncHandler } from "@/interfaces/https/utils/asyncHandler";

const repository = new PrismaCandidateRepository();
const service = new CandidateService(repository);

class CandidateController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const payload = registerCandidateSchema.parse(req.body);

    const result = await service.register(payload);

    return res.status(201).json(result);
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const payload = loginCandidateSchema.parse(req.body);

    const result = await service.login(payload);

    return res.status(200).json(result);
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);

    await service.forgotPassword(email);

    return res.json({ message: "E-mail enviado com instruções." });
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const payload = resetPasswordSchema.parse(req.body);

    await service.resetPassword(payload.token, payload.newPassword);

    return res.json({ message: "Senha alterada com sucesso!" });
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = candidateRefreshSchema.parse(req.body);

    const result = await service.refresh(refresh_token);

    return res.json(result);
  });
}

export default CandidateController;
