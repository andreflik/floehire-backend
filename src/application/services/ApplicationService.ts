import prisma from "@/prisma";

class ApplicationService {
  async apply(candidateId: string, jobId: string) {
    return prisma.$transaction(async (tx) => {
      // 1️⃣ Buscar vaga
      const job = await tx.jobs.findUnique({
        where: { id: jobId },
        include: { stages: true },
      });

      if (!job || job.status !== "OPEN") {
        throw new Error("JOB_NOT_AVAILABLE");
      }

      // 2️⃣ Verificar se já aplicou
      const alreadyApplied = await tx.job_candidates.findFirst({
        where: {
          job_id: jobId,
          candidate_id: candidateId,
        },
      });

      if (alreadyApplied) {
        throw new Error("ALREADY_APPLIED");
      }

      // 3️⃣ Encontrar stage inicial
      const firstStage = job.stages.sort(
        (a, b) => a.stage_order - b.stage_order,
      )[0];

      if (!firstStage) {
        throw new Error("PIPELINE_NOT_CONFIGURED");
      }

      // 4️⃣ Criar candidatura
      const application = await tx.job_candidates.create({
        data: {
          job_id: jobId,
          candidate_id: candidateId,
          current_stage_id: firstStage.id,
        },
      });

      // 5️⃣ Criar histórico inicial
      await tx.job_candidate_history.create({
        data: {
          job_candidate_id: application.id,
          from_stage_name: null,
          to_stage_name: firstStage.name,
          moved_by: "candidate",
        },
      });

      return application;
    });
  }

  async listByJob(jobId: string, recruiterId: string) {
    const job = await prisma.jobs.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId,
      },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    return prisma.job_candidates.findMany({
      where: { job_id: jobId },
      include: {
        candidate: {
          select: {
            id: true,
            full_name: true,
            email: true,
            linkedin_url: true,
            github_url: true,
            portfolio_url: true,
          },
        },
        current_stage: true,
      },
      orderBy: { created_at: "asc" },
    });
  }
}

export default ApplicationService;
