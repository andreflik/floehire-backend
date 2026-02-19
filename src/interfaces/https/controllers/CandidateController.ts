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
import { updateCandidateProfileSchema } from "@/application/validators/candidateProfileSchema";

const repository = new PrismaCandidateRepository();
const service = new CandidateService(repository);

class CandidateController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const payload = registerCandidateSchema.parse(req.body);

    const result = await service.register(payload);

    return res.status(201).json(result);
  });

  static profile = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = (req as any).user.id;

    const result = await service.getProfile(candidateId);

    return res.json(result);
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = (req as any).user.id;

    const payload = updateCandidateProfileSchema.parse(req.body);

    const result = await service.updateProfile(candidateId, payload);

    return res.json(result);
  });

  static deleteExperience = asyncHandler(
    async (req: Request, res: Response) => {
      const candidateId = (req as any).user.sub;
      const { id } = req.params;

      await service.deleteExperience(candidateId, id);

      return res.json({ message: "Experiência removida com sucesso" });
    },
  );

  static deleteEducation = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = (req as any).user.sub;
    const { id } = req.params;

    await service.deleteEducation(candidateId, id);

    return res.json({ message: "Formação removida com sucesso" });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const payload = loginCandidateSchema.parse(req.body);

    const result = await service.login(payload);

    return res.status(200).json(result);
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message: "Refresh token é obrigatório" });
    }

    await service.logout(refresh_token);

    return res.json({ message: "Logout realizado com sucesso" });
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
