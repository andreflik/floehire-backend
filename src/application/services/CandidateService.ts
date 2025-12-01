import { RegisterCandidateDTO } from "../dtos/RegisterCandidateDTO";
import { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import * as bcrypt from "bcrypt";
import prisma from "@/prisma";

class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  async register(data: RegisterCandidateDTO) {
    console.log("🔥 [SERVICE] Início register()");
    console.log("📥 Dados recebidos:", data);

    try {
      console.log("🔍 Checando email...");
      const exists = await this.repository.findByEmail(data.email);

      if (exists) {
        console.log("⛔ EMAIL JÁ EXISTE");
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      console.log("🔐 Gerando hash da senha...");
      const password_hash = await bcrypt.hash(data.password, 10);

      console.log("🔧 Iniciando transaction...");

      const result = await prisma.$transaction(async (tx) => {
        console.log("🧱 Criando candidato...");

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

        // =====================================================
        // EXPERIÊNCIAS PROFISSIONAIS
        // =====================================================
        const experiencesCreated: any[] = [];

        if (data.experiences?.length) {
          console.log(`🚧 Criando ${data.experiences.length} experiências...`);

          for (const exp of data.experiences) {
            const saved = await tx.candidate_experiences.create({
              data: {
                candidate_id: candidate.id,
                job_title: exp.job_title ?? null,
                responsibilities: exp.responsibilities ?? null,
                start_date: exp.start_date
                  ? new Date(`${exp.start_date}-01`)
                  : null,
                end_date: exp.end_date ? new Date(`${exp.end_date}-01`) : null,
              },
            });

            console.log("📌 Experiência salva:", saved.id);
            experiencesCreated.push(saved);
          }
        } else {
          console.log("⚠️ Nenhuma experiência enviada");
        }

        // =====================================================
        // EDUCAÇÃO
        // =====================================================
        console.log("🎓 Criando educação...");

        const educationSaved = await tx.candidate_education.create({
          data: {
            candidate_id: candidate.id,
            escolaridade: data.escolaridade ?? null,
            curso: data.curso ?? null,
            instituicao: data.instituicao ?? null,
            ano_conclusao: data.ano_conclusao ?? null,
            certificacoes: data.certificacoes ?? null,
            idiomas: data.idiomas ?? null,
          },
        });

        console.log("🎓 Educação salva:", educationSaved.id);

        return {
          candidate,
          experiences: experiencesCreated,
          education: educationSaved,
        };
      });

      console.log("🏁 Resultado final:", result);

      return {
        ...result.candidate,
        experiences: result.experiences,
        education: result.education,
      };
    } catch (err) {
      console.error("💥 ERRO NO SERVICE:", err);
      throw err;
    }
  }
}

export default CandidateService;
