import prisma from "@/prisma";
import { CreateJobDTO } from "../dtos/CreateJobDTO";

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
      // 1️⃣ Criar vaga
      const job = await tx.jobs.create({
        data: {
          recruiter_id: recruiterId,
          title: data.title,
          description: data.description,
          seniority: data.seniority,
          work_model: data.work_model,
          contract_type: data.contract_type,
          hire_type: data.hire_type,
          city: data.city,
          state: data.state,
          salary_min: data.salary_min,
          salary_max: data.salary_max,
          deadline: data.deadline ? new Date(data.deadline) : null,
        },
      });

      // 2️⃣ Criar pipeline padrão
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
      where: { recruiter_id: recruiterId },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(jobId: string, recruiterId: string) {
    const job = await prisma.jobs.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId,
      },
      include: {
        stages: { orderBy: { stage_order: "asc" } },
      },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    return job;
  }

  async listPublic(params: { skip: number; take: number }) {
    const { skip, take } = params;

    return prisma.jobs.findMany({
      where: {
        status: "OPEN",
      },
      orderBy: {
        created_at: "desc",
      },
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
      where: {
        status: "OPEN",
      },
    });
  }
}

export default JobService;
