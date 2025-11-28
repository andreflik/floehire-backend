import { RegisterCandidateDTO } from "../dtos/RegisterCandidateDTO";
import { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import * as bcrypt from "bcrypt";

class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  async register(data: RegisterCandidateDTO) {
    const exists = await this.repository.findByEmail(data.email);

    if (exists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const candidate = await this.repository.create({
      full_name: data.full_name,
      email: data.email,

      phone: data.phone ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      linkedin_url: data.linkedin_url ?? null,
      github_url: data.github_url ?? null,
      portfolio_url: data.portfolio_url ?? null,

      password_hash,

      lgpd_consent: data.lgpd_consent,
    });

    return {
      id: candidate.id,
      full_name: candidate.full_name,
      email: candidate.email,
      phone: candidate.phone,
      city: candidate.city,
      state: candidate.state,
      linkedin_url: candidate.linkedin_url,
      github_url: candidate.github_url,
      portfolio_url: candidate.portfolio_url,
      created_at: candidate.created_at,
    };
  }
}

export default CandidateService;
