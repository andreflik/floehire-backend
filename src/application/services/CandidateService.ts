import { RegisterCandidateDTO } from "../dtos/RegisterCandidateDTO";
import { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import { LoginCandidateDTO } from "../dtos/LoginCandidateDTO";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";
import crypto from "crypto";

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

  async login(data: LoginCandidateDTO) {
    console.log("🔐 [SERVICE] Login iniciado:", data.email);

    const candidate = await this.repository.findByEmail(data.email);

    if (!candidate) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Verifica a senha
    const isValidPassword = await bcrypt.compare(
      data.password,
      candidate.password_hash
    );

    if (!isValidPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        sub: candidate.id,
        email: candidate.email,
        role: "candidate",
      },
      process.env.JWT_SECRET || "dev-secret",
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
      candidate: {
        id: candidate.id,
        full_name: candidate.full_name,
        email: candidate.email,
      },
    };
  }

  async forgotPassword(email: string) {
    const candidate = await prisma.candidates.findUnique({ where: { email } });

    if (!candidate) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.password_reset_tokens.create({
      data: {
        email,
        token,
        expires_at: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    console.log("📧 Link de redefinição:");
    console.log(`http://localhost:5173/resetar-senha?token=${token}`);
  }

  async resetPassword(token: string, newPassword: string) {
    const reset = await prisma.password_reset_tokens.findFirst({
      where: { token },
    });

    if (!reset || reset.expires_at < new Date()) {
      throw new Error("INVALID_TOKEN");
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.candidates.update({
      where: { email: reset.email },
      data: { password_hash: hash },
    });

    await prisma.password_reset_tokens.delete({ where: { id: reset.id } });
  }
}

export default CandidateService;
