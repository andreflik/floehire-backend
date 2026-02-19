import { RegisterCandidateDTO } from "../dtos/RegisterCandidateDTO";
import { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import { LoginCandidateDTO } from "../dtos/LoginCandidateDTO";
import * as bcrypt from "bcrypt";
import prisma from "@/prisma";
import crypto from "crypto";
import { signAccessToken } from "@/infra/security/jwt";
import { EmailService } from "@/infra/mail/EmailService";
import { resetPasswordTemplate } from "@/infra/mail/templates/resetPasswordTemplate";

class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  async register(data: RegisterCandidateDTO) {
    try {
      const exists = await this.repository.findByEmail(data.email);

      if (exists) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      const password_hash = await bcrypt.hash(data.password, 10);

      const result = await prisma.$transaction(async (tx) => {
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

        const experiencesCreated: any[] = [];

        if (data.experiences?.length) {
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

            experiencesCreated.push(saved);
          }
        } else {
        }

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

        return {
          candidate,
          experiences: experiencesCreated,
          education: educationSaved,
        };
      });

      return {
        ...result.candidate,
        experiences: result.experiences,
        education: result.education,
      };
    } catch (err) {
      throw err;
    }
  }

  async getProfile(candidateId: string) {
    const candidate = await prisma.candidates.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        linkedin_url: true,
        github_url: true,
        portfolio_url: true,
        created_at: true,

        candidate_education: {
          select: {
            escolaridade: true,
            curso: true,
            instituicao: true,
            ano_conclusao: true,
            certificacoes: true,
            idiomas: true,
          },
        },

        candidate_experiences: {
          select: {
            id: true,
            job_title: true,
            responsibilities: true,
            start_date: true,
            end_date: true,
          },
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

  async updateProfile(
    candidateId: string,
    data: {
      full_name?: string;
      phone?: string | null;
      city?: string | null;
      state?: string | null;
      linkedin_url?: string | null;
      github_url?: string | null;
      portfolio_url?: string | null;

      education?: Array<{
        escolaridade?: string;
        curso?: string;
        instituicao?: string;
        ano_conclusao?: string;
        certificacoes?: string;
        idiomas?: string;
      }>;

      experiences?: Array<{
        job_title?: string;
        responsibilities?: string;
        start_date?: string;
        end_date?: string;
      }>;
    },
  ) {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Atualiza dados básicos
      const candidate = await tx.candidates.update({
        where: { id: candidateId },
        data: {
          full_name: data.full_name,
          phone: data.phone ?? null,
          city: data.city ?? null,
          state: data.state ?? null,
          linkedin_url: data.linkedin_url ?? null,
          github_url: data.github_url ?? null,
          portfolio_url: data.portfolio_url ?? null,
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          linkedin_url: true,
          github_url: true,
          portfolio_url: true,
        },
      });

      // 2. Adiciona novas formações (SEM apagar as antigas)
      if (data.education && data.education.length > 0) {
        await tx.candidate_education.createMany({
          data: data.education.map((edu) => ({
            candidate_id: candidateId,
            escolaridade: edu.escolaridade ?? null,
            curso: edu.curso ?? null,
            instituicao: edu.instituicao ?? null,
            ano_conclusao: edu.ano_conclusao ?? null,
            certificacoes: edu.certificacoes ?? null,
            idiomas: edu.idiomas ?? null,
          })),
        });
      }

      // 3. Adiciona novas experiências (SEM apagar as antigas)
      if (data.experiences && data.experiences.length > 0) {
        await tx.candidate_experiences.createMany({
          data: data.experiences.map((exp) => ({
            candidate_id: candidateId,
            job_title: exp.job_title ?? null,
            responsibilities: exp.responsibilities ?? null,
            start_date: exp.start_date
              ? new Date(`${exp.start_date}-01`)
              : null,
            end_date: exp.end_date ? new Date(`${exp.end_date}-01`) : null,
          })),
        });
      }

      return candidate;
    });

    return result;
  }
  async login(data: LoginCandidateDTO) {
    const candidate = await this.repository.findByEmail(data.email);

    if (!candidate) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      candidate.password_hash,
    );

    if (!isValidPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const accessToken = signAccessToken(
      {
        sub: candidate.id,
        email: candidate.email,
        role: "candidate",
      },
      "15m",
    );

    const refreshToken = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

    await (prisma as any).candidate_refresh_tokens.create({
      data: {
        candidate_id: candidate.id,
        token: refreshToken,
        expires_at: expiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      candidate: {
        id: candidate.id,
        full_name: candidate.full_name,
        email: candidate.email,
      },
    };
  }

  async logout(refreshToken: string) {
    await (prisma as any).candidate_refresh_tokens.deleteMany({
      where: { token: refreshToken },
    });
  }

  async forgotPassword(email: string) {
    const candidate = await this.repository.findByEmail(email);

    if (!candidate) {
      throw new Error("EMAIL_NOT_FOUND");
    }

    const token = crypto.randomUUID();

    await prisma.password_reset_tokens.deleteMany({
      where: { email },
    });

    await prisma.password_reset_tokens.create({
      data: {
        email,
        token,
        expires_at: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/resetar-senha/${token}`;

    const mailService = new EmailService();

    await mailService.sendMail({
      to: email,
      subject: "Redefinição de senha - FloeHire",
      html: resetPasswordTemplate(resetLink),
    });

    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await prisma.password_reset_tokens.findUnique({
      where: { token },
    });

    if (!record) {
      throw new Error("TOKEN_INVALIDO");
    }

    if (record.expires_at < new Date()) {
      throw new Error("TOKEN_EXPIRADO");
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.candidates.update({
      where: { email: record.email },
      data: { password_hash: hash },
    });

    await prisma.password_reset_tokens.delete({
      where: { token },
    });

    return true;
  }

  async refresh(refreshToken: string) {
    const stored = await (prisma as any).candidate_refresh_tokens.findUnique({
      where: { token: refreshToken },
      include: { candidate: true },
    });

    if (!stored) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    if (stored.expires_at < new Date()) {
      await (prisma as any).candidate_refresh_tokens.delete({
        where: { token: refreshToken },
      });

      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    const newAccessToken = signAccessToken(
      {
        sub: stored.candidate.id,
        email: stored.candidate.email,
        role: "candidate",
      },
      "15m",
    );

    return {
      access_token: newAccessToken,
    };
  }
}

export default CandidateService;
