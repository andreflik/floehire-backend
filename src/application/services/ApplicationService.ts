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

  async moveStage(params: {
    applicationId: string;
    toStageId: string;
    recruiterId: string;
  }) {
    const { applicationId, toStageId, recruiterId } = params;

    return prisma.$transaction(async (tx) => {
      // 1️⃣ Buscar candidatura + job
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

      // 2️⃣ Validar se a vaga pertence ao recruiter
      if (application.job.recruiter_id !== recruiterId) {
        throw new Error("FORBIDDEN");
      }

      // 3️⃣ Buscar stage destino
      const targetStage = await tx.job_stages.findUnique({
        where: { id: toStageId },
      });

      if (!targetStage) {
        throw new Error("INVALID_STAGE");
      }

      // 4️⃣ Garantir que a stage pertence ao mesmo job
      if (targetStage.job_id !== application.job_id) {
        throw new Error("STAGE_NOT_FROM_JOB");
      }

      // 5️⃣ Atualizar candidatura
      const updated = await tx.job_candidates.update({
        where: { id: applicationId },
        data: {
          current_stage_id: toStageId,
        },
        include: {
          candidate: {
            select: {
              id: true,
              full_name: true,
              email: true,
              linkedin_url: true,
            },
          },
          current_stage: true,
        },
      });

      // 6️⃣ Criar histórico
      await tx.job_candidate_history.create({
        data: {
          job_candidate_id: applicationId,
          from_stage_name: application.current_stage?.name ?? null,
          to_stage_name: targetStage.name,
          moved_by: "recruiter",
        },
      });

      return updated;
    });
  }

  async listByCandidate(candidateId: string) {
    return prisma.job_candidates.findMany({
      where: {
        candidate_id: candidateId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        current_stage: {
          select: {
            name: true,
            stage_order: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}

export default ApplicationService;
