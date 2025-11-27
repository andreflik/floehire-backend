import prisma from "../prisma";
import bcrypt from "bcrypt";

interface RegisterCandidateDTO {
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  password: string;
  lgpd_consent: boolean;
}

class CandidateService {
  async register(data: RegisterCandidateDTO) {
    const exists = await prisma.candidates.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const candidate = await prisma.candidates.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        state: data.state,
        linkedin_url: data.linkedin_url,
        github_url: data.github_url,
        portfolio_url: data.portfolio_url,
        password_hash,
        lgpd_consent: data.lgpd_consent,
      },
    });

    return candidate;
  }
}

export default new CandidateService();
