import { Request, Response } from "express";
import { PipelineKanbanService } from "@/application/services/PipelineKanbanService";
import { getAuthUser } from "../utils/getAuthUser";

const service = new PipelineKanbanService();

class PipelineKanbanController {
  static async show(req: Request, res: Response) {
    try {
      const user = getAuthUser(req);

      const { jobId } = req.params;

      const pipeline = await service.getKanban(jobId, user.id);

      return res.json(pipeline);
    } catch (error: any) {
      if (error.message === "JOB_NOT_FOUND") {
        return res.status(404).json({ error: "JOB_NOT_FOUND" });
      }

      console.error("PipelineKanbanController error:", error);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
}

export default PipelineKanbanController;
