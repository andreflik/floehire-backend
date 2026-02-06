import prisma from "@/prisma";
import { NotFoundError } from "@/application/errors/NotFoundError";
import { ForbiddenError } from "@/application/errors/ForbiddenError";
import { AppError } from "@/application/errors/AppError";

class ApplicationService {
  async apply(candidateId: string, jobId: string) {
    return prisma.$transaction(async (tx) => {
      const job = await tx.jobs.findUnique({
        where: { id: jobId },
        include: { stages: true },
      });

      if (!job || job.status !== "OPEN") {
        throw new AppError(
          "Vaga não disponível para candidatura",
          "JOB_NOT_AVAILABLE",
          400,
        );
      }

      const alreadyApplied = await tx.job_candidates.findFirst({
        where: {
          job_id: jobId,
          candidate_id: candidateId,
        },
      });

      if (alreadyApplied) {
        throw new AppError(
          "Candidato já se aplicou para esta vaga",
          "ALREADY_APPLIED",
          409,
        );
      }

      const firstStage = job.stages.sort(
        (a, b) => a.stage_order - b.stage_order,
      )[0];

      if (!firstStage) {
        throw new AppError(
          "Pipeline da vaga não está configurado",
          "PIPELINE_NOT_CONFIGURED",
          500,
        );
      }

      const application = await tx.job_candidates.create({
        data: {
          job_id: jobId,
          candidate_id: candidateId,
          current_stage_id: firstStage.id,
        },
      });

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
      throw new NotFoundError("JOB_NOT_FOUND", "Vaga não encontrada");
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
      const application = await tx.job_candidates.findUnique({
        where: { id: applicationId },
        include: {
          job: true,
          current_stage: true,
        },
      });

      if (!application) {
        throw new NotFoundError(
          "APPLICATION_NOT_FOUND",
          "Candidatura não encontrada",
        );
      }

      if (application.job.recruiter_id !== recruiterId) {
        throw new ForbiddenError(
          "FORBIDDEN",
          "Você não tem permissão para mover esta candidatura",
        );
      }

      const targetStage = await tx.job_stages.findUnique({
        where: { id: toStageId },
      });

      if (!targetStage) {
        throw new NotFoundError("INVALID_STAGE", "Etapa não encontrada");
      }

      if (targetStage.job_id !== application.job_id) {
        throw new AppError(
          "Stage não pertence a esta vaga",
          "STAGE_NOT_FROM_JOB",
          400,
        );
      }

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

  async evaluateApplication(params: {
    applicationId: string;
    recruiterId: string;
    rating?: number;
    notes?: string | null;
  }) {
    const { applicationId, recruiterId, rating, notes } = params;

    return prisma.$transaction(async (tx) => {
      const application = await tx.job_candidates.findUnique({
        where: { id: applicationId },
        include: {
          job: true,
        },
      });

      if (!application) {
        throw new NotFoundError(
          "APPLICATION_NOT_FOUND",
          "Candidatura não encontrada",
        );
      }

      if (application.job.recruiter_id !== recruiterId) {
        throw new ForbiddenError(
          "FORBIDDEN",
          "Você não pode avaliar esta candidatura",
        );
      }

      const updated = await tx.job_candidates.update({
        where: { id: applicationId },
        data: {
          rating: rating ?? application.rating,
          notes: notes ?? application.notes,
        },
      });

      await tx.job_candidate_history.create({
        data: {
          job_candidate_id: applicationId,
          from_stage_name: application.current_stage_id ? "EVALUATION" : null,
          to_stage_name: application.current_stage_id ? "EVALUATION" : null,
          moved_by: "recruiter",
          comment: "Evaluation updated",
        },
      });

      return updated;
    });
  }

  async getApplicationHistory(applicationId: string, recruiterId: string) {
    const application = await prisma.job_candidates.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      throw new NotFoundError(
        "APPLICATION_NOT_FOUND",
        "Candidatura não encontrada",
      );
    }

    if (application.job.recruiter_id !== recruiterId) {
      throw new ForbiddenError(
        "FORBIDDEN",
        "Você não pode acessar o histórico desta candidatura",
      );
    }

    return prisma.job_candidate_history.findMany({
      where: {
        job_candidate_id: applicationId,
      },
      orderBy: {
        moved_at: "asc",
      },
    });
  }

  async removeApplication(applicationId: string, recruiterId: string) {
    return prisma.$transaction(async (tx) => {
      const application = await tx.job_candidates.findUnique({
        where: { id: applicationId },
        include: {
          job: true,
          current_stage: true,
        },
      });

      if (!application) {
        throw new NotFoundError(
          "APPLICATION_NOT_FOUND",
          "Candidatura não encontrada",
        );
      }

      if (application.job.recruiter_id !== recruiterId) {
        throw new ForbiddenError(
          "FORBIDDEN",
          "Você não pode remover esta candidatura",
        );
      }

      await tx.job_candidate_history.create({
        data: {
          job_candidate_id: applicationId,
          from_stage_name: application.current_stage?.name ?? null,
          to_stage_name: null,
          moved_by: "recruiter",
          comment: "Application removed",
        },
      });

      await tx.job_candidates.delete({
        where: { id: applicationId },
      });

      return true;
    });
  }
}

export default ApplicationService;
