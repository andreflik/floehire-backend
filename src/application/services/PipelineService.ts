import prisma from "@/prisma";
import { Prisma } from "@prisma/client";

class PipelineService {
  async moveApplication(
    applicationId: string,
    targetStageId: string,
    recruiterId: string,
  ) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const application = await tx.job_candidates.findUnique({
        where: { id: applicationId },
        include: {
          job: true,
          current_stage: true,
        },
      });

      if (!application) {
        throw new Error("APPLICATION_NOT_FOUND");
      }

      if (application.job.recruiter_id !== recruiterId) {
        throw new Error("FORBIDDEN");
      }

      const targetStage = await tx.job_stages.findUnique({
        where: { id: targetStageId },
      });

      if (!targetStage || targetStage.job_id !== application.job_id) {
        throw new Error("INVALID_STAGE");
      }

      if (application.current_stage_id === targetStageId) {
        throw new Error("SAME_STAGE");
      }

      const fromStageName = application.current_stage?.name ?? null;

      const updated = await tx.job_candidates.update({
        where: { id: applicationId },
        data: {
          current_stage_id: targetStageId,
        },
      });

      await tx.job_candidate_history.create({
        data: {
          job_candidate_id: applicationId,
          from_stage_name: fromStageName,
          to_stage_name: targetStage.name,
          moved_by: recruiterId,
        },
      });

      return updated;
    });
  }

  async getPipelineByJob(jobId: string) {
    const stages = await prisma.job_stages.findMany({
      where: { job_id: jobId },
      orderBy: { stage_order: "asc" },
      include: {
        candidates: {
          include: {
            candidate: {
              select: {
                id: true,
                full_name: true,
                email: true,
                linkedin_url: true,
              },
            },
          },
        },
      },
    });

    return {
      job_id: jobId,
      stages: stages.map((stage) => ({
        id: stage.id,
        name: stage.name,
        order: stage.stage_order,
        candidates: stage.candidates.map((app) => ({
          application_id: app.id,
          rating: app.rating,
          notes: app.notes,
          candidate: app.candidate,
        })),
      })),
    };
  }
}

export default PipelineService;
