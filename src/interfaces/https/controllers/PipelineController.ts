import { Request, Response } from "express";
import PipelineService from "@/application/services/PipelineService";

const service = new PipelineService();

export class PipelineController {
  static async getJobPipeline(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const recruiterId = req.user!.id;

      const pipeline = await service.getPipelineByJob(jobId, recruiterId);

      return res.json(pipeline);
    } catch (err: any) {
      console.error(err);

      return res.status(500).json({
        message: "Erro ao buscar pipeline",
      });
    }
  }

  static async moveCandidate(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const { applicationId, targetStageId } = req.body;
    const recruiterId = req.user.id;

    if (!applicationId || !targetStageId) {
      return res.status(400).json({ error: "INVALID_PAYLOAD" });
    }

    await service.moveCandidate(applicationId, targetStageId, recruiterId);

    return res.status(204).send();
  }

  static async move(req: Request, res: Response) {
    const recruiterId = req.user!.id;
    const { id } = req.params;
    const { to_stage_id } = req.body;

    const result = await service.moveCandidate(id, to_stage_id, recruiterId);

    return res.json(result);
  }
}
