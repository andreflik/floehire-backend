import prisma from "@/prisma";
import { extractPdfText } from "../../interfaces/https/utils/pdfParser";
import { parseCV } from "../../interfaces/https/utils/cvParser";

class TalentPoolService {
  async createCandidate(data: any) {
    const exists = await prisma.candidates.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("CANDIDATE_ALREADY_EXISTS");
    }

    const candidate = await prisma.candidates.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
        linkedin_url: data.linkedin_url ?? null,
        password_hash: "talent_pool_import",
        lgpd_consent: false,
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
      },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    const candidate = await prisma.candidates.findFirst({
      where: {
        id: candidateId,
      },
    });

    if (!candidate) {
      throw new Error("CANDIDATE_NOT_FOUND");
    }

    const exists = await prisma.job_candidates.findFirst({
      where: {
        candidate_id: candidateId,
        job_id: jobId,
      },
    });

    if (exists) {
      throw new Error("CANDIDATE_ALREADY_APPLIED");
    }

    const firstStage = await prisma.job_stages.findFirst({
      where: {
        job_id: jobId,
      },
      orderBy: {
        stage_order: "asc",
      },
    });

    if (!firstStage) {
      throw new Error("PIPELINE_NOT_CONFIGURED");
    }

    const application = await prisma.job_candidates.create({
      data: {
        job_id: jobId,
        candidate_id: candidateId,
        current_stage_id: firstStage.id,
      },
    });

    return application;
  }

  async createCandidateFromCV(buffer: Buffer) {
    const text = await extractPdfText(buffer);

    const parsed = parseCV(text);

    if (!parsed.email) {
      throw new Error("EMAIL_NOT_FOUND_IN_CV");
    }

    const exists = await prisma.candidates.findUnique({
      where: { email: parsed.email },
    });

    if (exists) {
      throw new Error("CANDIDATE_ALREADY_EXISTS");
    }

    const candidate = await prisma.candidates.create({
      data: {
        full_name: parsed.full_name ?? "Nome não identificado",
        email: parsed.email,
        phone: parsed.phone,
        password_hash: "imported_cv_candidate",
      },
    });

    return candidate;
  }
}

export default TalentPoolService;
