import prisma from "@/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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
      recruiter.password_hash,
    );

    if (!validPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 🔐 Access Token (curto)
    const accessToken = jwt.sign(
      {
        sub: recruiter.id,
        role: "recruiter",
      },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "15m" },
    );

    // 🔁 Refresh Token (longo)
    const refreshToken = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

    await prisma.recruiter_refresh_tokens.create({
      data: {
        recruiter_id: recruiter.id,
        token: refreshToken,
        expires_at: expiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      recruiter: {
        id: recruiter.id,
        company_name: recruiter.company_name,
        email: recruiter.email,
      },
    };
  }

  async refresh(refreshToken: string) {
    const storedToken = await prisma.recruiter_refresh_tokens.findUnique({
      where: { token: refreshToken },
      include: { recruiter: true },
    });

    if (!storedToken) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    if (storedToken.expires_at < new Date()) {
      await prisma.recruiter_refresh_tokens.delete({
        where: { token: refreshToken },
      });

      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    const newAccessToken = jwt.sign(
      {
        sub: storedToken.recruiter.id,
        role: "recruiter",
      },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "15m" },
    );

    return {
      access_token: newAccessToken,
    };
  }
}
