import prisma from "@/prisma";
import { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import { CandidateModel } from "@/domain/models/CandidateModel";

class PrismaCandidateRepository implements CandidateRepository {
  async findByEmail(email: string): Promise<CandidateModel | null> {
    const candidate = await prisma.candidates.findUnique({
      where: { email },
    });

    if (!candidate) return null;

    return {
      ...candidate,
      lgpd_consent: candidate.lgpd_consent ?? false,
      created_at: candidate.created_at ?? new Date(),
    };
  }

  async create(
    candidate: Omit<CandidateModel, "id" | "created_at">
  ): Promise<CandidateModel> {
    const created = await prisma.candidates.create({
      data: candidate,
    });

    return {
      ...created,
      lgpd_consent: created.lgpd_consent ?? false,
      created_at: created.created_at ?? new Date(),
    };
  }
}

export default PrismaCandidateRepository;
