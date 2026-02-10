import { RecruiterService } from "@/application/services/RecruiterService";
import prisma from "@/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Mocks
jest.mock("@/prisma", () => ({
  __esModule: true,
  default: {
    recruiters: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    recruiter_refresh_tokens: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("crypto");

describe("RecruiterService", () => {
  let service: RecruiterService;

  beforeEach(() => {
    service = new RecruiterService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new recruiter", async () => {
      (prisma.recruiters.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      (prisma.recruiters.create as jest.Mock).mockResolvedValue({
        id: "recruiter-id",
        company_name: "My Company",
        email: "test@test.com",
      });

      const result = await service.register({
        company_name: "My Company",
        email: "test@test.com",
        password: "123456",
      });

      expect(result).toEqual({
        id: "recruiter-id",
        company_name: "My Company",
        email: "test@test.com",
      });

      expect(prisma.recruiters.create).toHaveBeenCalled();
    });

    it("should throw error if recruiter already exists", async () => {
      (prisma.recruiters.findUnique as jest.Mock).mockResolvedValue({
        id: "existing-id",
      });

      await expect(
        service.register({
          company_name: "My Company",
          email: "test@test.com",
          password: "123456",
        }),
      ).rejects.toThrow("RECRUITER_ALREADY_EXISTS");
    });
  });

  describe("login", () => {
    it("should login successfully and return tokens", async () => {
      const recruiter = {
        id: "recruiter-id",
        company_name: "My Company",
        email: "test@test.com",
        password_hash: "hashed-password",
      };

      (prisma.recruiters.findUnique as jest.Mock).mockResolvedValue(recruiter);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("access-token");
      (crypto.randomUUID as jest.Mock).mockReturnValue("refresh-token");
      (prisma.recruiter_refresh_tokens.create as jest.Mock).mockResolvedValue(
        {},
      );

      const result = await service.login({
        email: "test@test.com",
        password: "123456",
      });

      expect(result).toHaveProperty("access_token", "access-token");
      expect(result).toHaveProperty("refresh_token", "refresh-token");
      expect(result.recruiter.email).toBe("test@test.com");
    });

    it("should throw error if recruiter not found", async () => {
      (prisma.recruiters.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({
          email: "test@test.com",
          password: "123456",
        }),
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should throw error if password is invalid", async () => {
      (prisma.recruiters.findUnique as jest.Mock).mockResolvedValue({
        id: "id",
        email: "test@test.com",
        password_hash: "hashed",
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: "test@test.com",
          password: "wrong",
        }),
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });
  });

  describe("refresh", () => {
    it("should return new access token if refresh token is valid", async () => {
      const storedToken = {
        token: "refresh-token",
        expires_at: new Date(Date.now() + 1000 * 60),
        recruiter: {
          id: "recruiter-id",
        },
      };

      (
        prisma.recruiter_refresh_tokens.findUnique as jest.Mock
      ).mockResolvedValue(storedToken);
      (jwt.sign as jest.Mock).mockReturnValue("new-access-token");

      const result = await service.refresh("refresh-token");

      expect(result).toEqual({ access_token: "new-access-token" });
    });

    it("should throw error if refresh token is invalid", async () => {
      (
        prisma.recruiter_refresh_tokens.findUnique as jest.Mock
      ).mockResolvedValue(null);

      await expect(service.refresh("invalid-token")).rejects.toThrow(
        "INVALID_REFRESH_TOKEN",
      );
    });

    it("should throw error if refresh token is expired", async () => {
      const storedToken = {
        token: "refresh-token",
        expires_at: new Date(Date.now() - 1000), // expired
        recruiter: {
          id: "recruiter-id",
        },
      };

      (
        prisma.recruiter_refresh_tokens.findUnique as jest.Mock
      ).mockResolvedValue(storedToken);
      (prisma.recruiter_refresh_tokens.delete as jest.Mock).mockResolvedValue(
        {},
      );

      await expect(service.refresh("refresh-token")).rejects.toThrow(
        "REFRESH_TOKEN_EXPIRED",
      );
    });
  });
});
