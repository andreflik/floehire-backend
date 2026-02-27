import prisma from "@/prisma";

class PipelineService {
  async getPipelineByJob(jobId: string, recruiterId: string) {
    const job = await prisma.jobs.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId,
      },
      include: {
        stages: {
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
        },
      },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    return {
      job_id: job.id,
      stages: job.stages.map((stage) => ({
        id: stage.id,
        name: stage.name,
        order: stage.stage_order,
        candidates: stage.candidates.map((application) => ({
          application_id: application.id,
          rating: application.rating,
          notes: application.notes,
          candidate: application.candidate,
        })),
      })),
    };
  }

  async moveCandidate(
    applicationId: string,
    targetStageId: string,
    recruiterId: string,
  ) {
    const application = await prisma.job_candidates.findFirst({
      where: {
        id: applicationId,
        job: {
          recruiter_id: recruiterId,
        },
      },
      include: {
        current_stage: true,
      },
    });

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    const targetStage = await prisma.job_stages.findFirst({
      where: {
        id: targetStageId,
        job_id: application.job_id,
      },
    });

    if (!targetStage) {
      throw new Error("TARGET_STAGE_NOT_FOUND");
    }

    await prisma.$transaction(async (tx) => {
      await tx.job_candidates.update({
        where: { id: applicationId },
        data: {
          current_stage_id: targetStageId,
        },
      });

      await tx.job_candidate_history.create({
        data: {
          job_candidate_id: applicationId,
          from_stage_name: application.current_stage?.name ?? null,
          to_stage_name: targetStage.name,
          moved_by: "recruiter",
        },
      });
    });

    return { success: true };
  }
}

export default PipelineService;
