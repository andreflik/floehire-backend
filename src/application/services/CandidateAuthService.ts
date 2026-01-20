import prisma from "@/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class CandidateAuthService {
  async login(email: string, password: string) {
    const candidate = await prisma.candidates.findUnique({ where: { email } });

    if (!candidate) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      candidate.password_hash,
    );

    if (!passwordMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      {
        id: candidate.id,
        email: candidate.email,
        name: candidate.full_name,
        role: "candidate",
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" },
    );

    return {
      id: candidate.id,
      full_name: candidate.full_name,
      email: candidate.email,
      token,
    };
  }
}

export default new CandidateAuthService();
