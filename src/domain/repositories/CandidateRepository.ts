import { CandidateModel } from "../models/CandidateModel";

export interface CandidateRepository {
  findByEmail(email: string): Promise<CandidateModel | null>;

  create(
    candidate: Omit<CandidateModel, "id" | "created_at">
  ): Promise<CandidateModel>;
}
