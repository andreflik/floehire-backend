import prisma from "@/prisma";
import { CreateJobDTO } from "../dtos/CreateJobDTO";
import { UpdateJobDTO } from "../dtos/UpdateJobDTO";
import { job_status } from "@prisma/client";
import { NotFoundError } from "@/application/errors/NotFoundError";

const DEFAULT_STAGES = [
  { name: "Applied", order: 1 },
  { name: "Screening", order: 2 },
  { name: "Interview", order: 3 },
  { name: "Offer", order: 4 },
  { name: "Hired", order: 5 },
  { name: "Rejected", order: 6 },
];

class JobService {
  async create(recruiterId: string, data: CreateJobDTO) {
    return prisma.$transaction(async (tx) => {
      const job = await tx.jobs.create({
        data: {
          recruiter_id: recruiterId,
          title: data.title,
          description: data.description ?? null,
          seniority: data.seniority ?? null,
          work_model: data.work_model ?? null,
          contract_type: data.contract_type ?? null,
          hire_type: data.hire_type ?? null,
          city: data.city ?? null,
          state: data.state ?? null,
          salary_min: data.salary_min ?? null,
          salary_max: data.salary_max ?? null,
          deadline: data.deadline ? new Date(data.deadline) : null,
        },
      });

      for (const stage of DEFAULT_STAGES) {
        await tx.job_stages.create({
          data: {
            job_id: job.id,
            name: stage.name,
            stage_order: stage.order,
          },
        });
      }

      return job;
    });
  }

  async listByRecruiter(recruiterId: string) {
    return prisma.jobs.findMany({
      where: {
        recruiter_id: recruiterId,
        status: { not: job_status.ARCHIVED },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(jobId: string, recruiterId: string) {
    const job = await prisma.jobs.findFirst({
      where: { id: jobId, recruiter_id: recruiterId },
      include: { stages: { orderBy: { stage_order: "asc" } } },
    });

    if (!job) {
      throw new NotFoundError("JOB_NOT_FOUND", "Vaga não encontrada");
    }

    return job;
  }

  async listPublic({ skip, take }: { skip: number; take: number }) {
    return prisma.jobs.findMany({
      where: { status: job_status.OPEN },
      orderBy: { created_at: "desc" },
      skip,
      take,
      select: {
        id: true,
        title: true,
        description: true,
        seniority: true,
        contract_type: true,
        work_model: true,
        city: true,
        state: true,
        created_at: true,
      },
    });
  }

  async countPublic() {
    return prisma.jobs.count({
      where: { status: job_status.OPEN },
    });
  }

  async getPublicById(jobId: string) {
    const job = await prisma.jobs.findFirst({
      where: { id: jobId, status: job_status.OPEN },
    });

    if (!job) {
      throw new NotFoundError("JOB_NOT_FOUND", "Vaga não encontrada");
    }

    return job;
  }

  async update(jobId: string, recruiterId: string, data: UpdateJobDTO) {
    const job = await prisma.jobs.findFirst({
      where: { id: jobId, recruiter_id: recruiterId },
    });

    if (!job) {
      throw new NotFoundError("JOB_NOT_FOUND", "Vaga não encontrada");
    }

    if (
      job.status === job_status.CLOSED ||
      job.status === job_status.ARCHIVED
    ) {
      throw new Error("JOB_NOT_EDITABLE");
    }

    return prisma.jobs.update({
      where: { id: jobId },
      data: {
        title: data.title,
        description: data.description ?? undefined,
        seniority: data.seniority ?? undefined,
        work_model: data.work_model ?? undefined,
        contract_type: data.contract_type ?? undefined,
        hire_type: data.hire_type ?? undefined,
        city: data.city ?? undefined,
        state: data.state ?? undefined,
        salary_min: data.salary_min ?? undefined,
        salary_max: data.salary_max ?? undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    });
  }

  async delete(jobId: string, recruiterId: string) {
    const job = await prisma.jobs.findFirst({
      where: { id: jobId, recruiter_id: recruiterId },
    });

    if (!job) {
      throw new NotFoundError("JOB_NOT_FOUND", "Vaga não encontrada");
    }

    if (job.status === job_status.ARCHIVED) {
      throw new Error("JOB_ALREADY_ARCHIVED");
    }

    return prisma.jobs.update({
      where: { id: jobId },
      data: { status: job_status.ARCHIVED },
    });
  }

  async updateStatus(jobId: string, recruiterId: string, status: job_status) {
    const job = await prisma.jobs.findFirst({
      where: { id: jobId, recruiter_id: recruiterId },
    });

    if (!job) {
      throw new NotFoundError("JOB_NOT_FOUND", "Vaga não encontrada");
    }

    if (job.status === job_status.ARCHIVED) {
      throw new Error("JOB_ARCHIVED_CANNOT_CHANGE_STATUS");
    }

    if (job.status === status) {
      return job;
    }

    return prisma.jobs.update({
      where: { id: jobId },
      data: { status },
    });
  }
}

export default JobService;
