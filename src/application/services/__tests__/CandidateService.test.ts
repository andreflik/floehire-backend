import CandidateService from "@/application/services/CandidateService";
import { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import prisma from "@/prisma";

jest.mock("@/prisma", () => ({
  __esModule: true,
  default: require("@/__mocks__/prisma").default,
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

import bcrypt from "bcrypt";

jest.mock("@/infra/security/jwt", () => ({
  signAccessToken: jest.fn().mockReturnValue("fake-access-token"),
}));

describe("CandidateService", () => {
  let service: CandidateService;
  let repository: jest.Mocked<CandidateRepository>;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
    } as any;

    service = new CandidateService(repository);
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new candidate successfully", async () => {
      repository.findByEmail.mockResolvedValue(null as any);

      (prisma as any).$transaction.mockImplementation(async (cb: any) => {
        return cb({
          candidates: {
            create: jest.fn().mockResolvedValue({
              id: "cand-1",
              full_name: "John Doe",
              email: "john@test.com",
            }),
          },
          candidate_experiences: {
            create: jest.fn(),
          },
          candidate_education: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.register({
        full_name: "John Doe",
        email: "john@test.com",
        password: "123456",
        lgpd_consent: true,
      } as any);

      expect(result.email).toBe("john@test.com");
      expect(repository.findByEmail).toHaveBeenCalledWith("john@test.com");
    });

    it("should throw error if email already exists", async () => {
      repository.findByEmail.mockResolvedValue({ id: "existing" } as any);

      await expect(
        service.register({
          full_name: "John Doe",
          email: "john@test.com",
          password: "123456",
          lgpd_consent: true,
        } as any),
      ).rejects.toThrow("EMAIL_ALREADY_EXISTS");
    });
  });

  describe("login", () => {
    it("should throw error if candidate not found", async () => {
      repository.findByEmail.mockResolvedValue(null as any);

      await expect(
        service.login({ email: "x@test.com", password: "123" }),
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should throw error if password is invalid", async () => {
      repository.findByEmail.mockResolvedValue({
        id: "cand-1",
        email: "x@test.com",
        password_hash: "hash",
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: "x@test.com", password: "wrong" }),
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should login successfully and return tokens", async () => {
      repository.findByEmail.mockResolvedValue({
        id: "cand-1",
        email: "x@test.com",
        full_name: "Test",
        password_hash: "hash",
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (prisma as any).candidate_refresh_tokens.create.mockResolvedValue({});

      const result = await service.login({
        email: "x@test.com",
        password: "123",
      });

      expect(result.access_token).toBe("fake-access-token");
      expect(result.refresh_token).toBeDefined();
      expect(result.candidate.email).toBe("x@test.com");
    });
  });

  describe("refresh", () => {
    it("should throw error if refresh token is invalid", async () => {
      (prisma as any).candidate_refresh_tokens.findUnique.mockResolvedValue(
        null,
      );

      await expect(service.refresh("invalid-token")).rejects.toThrow(
        "INVALID_REFRESH_TOKEN",
      );
    });
  });
});
