import prisma from "@/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterRecruiterDTO {
  company_name: string;
  email: string;
  password: string;
}

interface LoginRecruiterDTO {
  email: string;
  password: string;
}

export class RecruiterService {
  async register(data: RegisterRecruiterDTO) {
    const exists = await prisma.recruiters.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("RECRUITER_ALREADY_EXISTS");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const recruiter = await prisma.recruiters.create({
      data: {
        company_name: data.company_name,
        email: data.email,
        password_hash,
      },
    });

    return {
      id: recruiter.id,
      company_name: recruiter.company_name,
      email: recruiter.email,
    };
  }

  async login(data: LoginRecruiterDTO) {
    const recruiter = await prisma.recruiters.findUnique({
      where: { email: data.email },
    });

    if (!recruiter) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const validPassword = await bcrypt.compare(
      data.password,
      recruiter.password_hash
    );

    if (!validPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      {
        sub: recruiter.id,
        role: "recruiter",
      },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1d" }
    );

    return {
      token,
      recruiter: {
        id: recruiter.id,
        company_name: recruiter.company_name,
        email: recruiter.email,
      },
    };
  }
}
