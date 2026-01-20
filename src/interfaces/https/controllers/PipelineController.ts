import { Request, Response } from "express";
import PipelineService from "@/application/services/PipelineService";

const service = new PipelineService();

export class PipelineController {
  static async getJobPipeline(req: Request, res: Response) {
    try {
      const { jobId } = req.params;

      const pipeline = await service.getPipelineByJob(jobId);

      return res.json(pipeline);
    } catch (err: any) {
      console.error(err);

      return res.status(500).json({
        message: "Erro ao buscar pipeline",
      });
    }
  }
}
