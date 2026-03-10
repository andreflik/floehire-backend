import { Request, Response } from "express";
import TalentPoolService from "@/application/services/TalentPoolService";
import { asyncHandler } from "../utils/asyncHandler";

const service = new TalentPoolService();

class TalentPoolController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;

    const candidate = await service.createCandidate(recruiterId, req.body);

    return res.status(201).json(candidate);
  });

  static list = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;

    const candidates = await service.listCandidates(recruiterId);

    return res.json(candidates);
  });

  static show = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { candidateId } = req.params;

    const candidate = await service.getCandidate(recruiterId, candidateId);

    return res.json(candidate);
  });

  static applyToJob = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;

    const { candidateId } = req.params;
    const { job_id } = req.body;

    const application = await service.applyCandidateToJob(
      recruiterId,
      candidateId,
      job_id,
    );

    return res.status(201).json(application);
  });
}

export default TalentPoolController;
