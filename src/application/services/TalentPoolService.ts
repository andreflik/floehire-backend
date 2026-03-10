import prisma from "@/prisma";

class TalentPoolService {
  async createCandidate(recruiterId: string, data: any) {
    const exists = await prisma.candidates.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("CANDIDATE_ALREADY_EXISTS");
    }

    const candidate = await prisma.candidates.create({
      data: {
        recruiter_id: recruiterId,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
        linkedin_url: data.linkedin_url ?? null,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        linkedin_url: true,
      },
    });

    return candidate;
  }

  async listCandidates(recruiterId: string) {
    const candidates = await prisma.candidates.findMany({
      where: {
        recruiter_id: recruiterId,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        linkedin_url: true,
        created_at: true,
      },
    });

    return candidates;
  }

  async getCandidate(recruiterId: string, candidateId: string) {
    const candidate = await prisma.candidates.findFirst({
      where: {
        id: candidateId,
        recruiter_id: recruiterId,
      },
      include: {
        candidate_experiences: {
          orderBy: {
            start_date: "desc",
          },
        },
      },
    });

    if (!candidate) {
      throw new Error("CANDIDATE_NOT_FOUND");
    }

    return candidate;
  }

  async applyCandidateToJob(
    recruiterId: string,
    candidateId: string,
    jobId: string,
  ) {
    const job = await prisma.jobs.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId,
      },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    const candidate = await prisma.candidates.findFirst({
      where: {
        id: candidateId,
        recruiter_id: recruiterId,
      },
    });

    if (!candidate) {
      throw new Error("CANDIDATE_NOT_FOUND");
    }

    const exists = await prisma.applications.findFirst({
      where: {
        candidate_id: candidateId,
        job_id: jobId,
      },
    });

    if (exists) {
      throw new Error("CANDIDATE_ALREADY_APPLIED");
    }

    const firstStage = await prisma.pipeline_stages.findFirst({
      where: {
        job_id: jobId,
      },
      orderBy: {
        order: "asc",
      },
    });

    if (!firstStage) {
      throw new Error("PIPELINE_NOT_CONFIGURED");
    }

    const application = await prisma.applications.create({
      data: {
        job_id: jobId,
        candidate_id: candidateId,
        stage_id: firstStage.id,
      },
    });

    return application;
  }
}

export default TalentPoolService;
