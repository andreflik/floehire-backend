import prisma from "@/prisma";

export class PipelineKanbanService {
  async getKanban(jobId: string, recruiterId: string) {
    const job = await prisma.jobs.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId,
      },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    const stages = await prisma.job_stages.findMany({
      where: {
        job_id: jobId,
      },
      orderBy: {
        stage_order: "asc",
      },
      include: {
        candidates: {
          include: {
            candidate: true,
          },
        },
      },
    });

    return stages.map((stage) => ({
      stage_id: stage.id,
      stage_name: stage.name,
      order: stage.stage_order,
      applications: stage.candidates.map((app) => ({
        application_id: app.id,
        rating: app.rating,
        notes: app.notes,
        candidate: {
          id: app.candidate.id,
          full_name: app.candidate.full_name,
          email: app.candidate.email,
        },
      })),
    }));
  }
}
