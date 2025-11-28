import { RegisterCandidateDTO } from "../dtos/RegisterCandidateDTO";
import { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import * as bcrypt from "bcrypt";
import prisma from "@/prisma";

class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  async register(data: RegisterCandidateDTO) {
    console.log("📥 Dados recebidos:", data);
    console.log("📥 EXPERIENCE RECEBIDA:", data.experience);

    const exists = await this.repository.findByEmail(data.email);
    if (exists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Cria o candidato
      const candidate = await tx.candidates.create({
        data: {
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
        },
      });

      console.log("✅ Candidato criado:", candidate.id);

      let experienceCreated = null;

      // 2️⃣ Se houver experiência, cria ela
      if (data.experience) {
        console.log("📥 Criando experiência para:", candidate.id);

        experienceCreated = await tx.candidate_experiences.create({
          data: {
            candidate_id: candidate.id,
            job_title: data.experience.job_title ?? null,
            responsibilities: data.experience.responsibilities ?? null,
            start_date: data.experience.start_date
              ? new Date(`${data.experience.start_date}T00:00:00`)
              : null,
            end_date: data.experience.end_date
              ? new Date(`${data.experience.end_date}T00:00:00`)
              : null,
          },
        });

        console.log("✅ Experiência salva:", experienceCreated.id);
      } else {
        console.log("⚠️ Nenhuma experiência enviada!");
      }

      // 3️⃣ Retorna tudo
      return {
        candidate,
        experience: experienceCreated,
      };
    });

    // Resposta organizada pro front
    return {
      id: result.candidate.id,
      full_name: result.candidate.full_name,
      email: result.candidate.email,
      phone: result.candidate.phone,
      city: result.candidate.city,
      state: result.candidate.state,
      linkedin_url: result.candidate.linkedin_url,
      github_url: result.candidate.github_url,
      portfolio_url: result.candidate.portfolio_url,
      lgpd_consent: result.candidate.lgpd_consent,
      created_at: result.candidate.created_at,

      experience: result.experience
        ? {
            id: result.experience.id,
            job_title: result.experience.job_title,
            start_date: result.experience.start_date,
            end_date: result.experience.end_date,
            responsibilities: result.experience.responsibilities,
          }
        : null,
    };
  }
}

export default CandidateService;
