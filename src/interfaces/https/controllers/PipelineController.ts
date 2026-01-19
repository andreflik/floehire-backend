import express from "express";
import PipelineService from "@/application/services/PipelineService";

type Request = express.Request;
type Response = express.Response;

const service = new PipelineService();

class PipelineController {
  static async move(req: Request, res: Response) {
    console.log("📦 MOVE PIPELINE BODY:", req.body);
    console.log("📦 PARAMS:", req.params);
    console.log("👤 USER:", req.user);

    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const recruiterId = req.user.id;
    const { applicationId } = req.params;
    const { target_stage_id } = req.body;

    if (!target_stage_id) {
      return res.status(400).json({ error: "TARGET_STAGE_REQUIRED" });
    }

    const result = await service.moveApplication(
      applicationId,
      target_stage_id,
      recruiterId,
    );

    return res.json(result);
  }
}

export default PipelineController;
