import ApplicationService from "@/application/services/ApplicationService";
import prisma from "@/prisma";
import { AppError } from "@/application/errors/AppError";
import { ForbiddenError } from "@/application/errors/ForbiddenError";
import { NotFoundError } from "@/application/errors/NotFoundError";

// Mock do prisma
jest.mock("@/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    jobs: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    job_candidates: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    job_stages: {
      findUnique: jest.fn(),
    },
    job_candidate_history: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const service = new ApplicationService();

describe("ApplicationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("apply", () => {
    it("deve criar uma candidatura com sucesso", async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          jobs: {
            findUnique: jest.fn().mockResolvedValue({
              id: "job-1",
              status: "OPEN",
              stages: [{ id: "stage-1", name: "Applied", stage_order: 1 }],
            }),
          },
          job_candidates: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: "app-1" }),
          },
          job_candidate_history: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.apply("cand-1", "job-1");

      expect(result).toEqual({ id: "app-1" });
    });

    it("deve falhar se a vaga não estiver aberta", async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          jobs: {
            findUnique: jest.fn().mockResolvedValue({
              id: "job-1",
              status: "CLOSED",
              stages: [],
            }),
          },
        });
      });

      await expect(service.apply("cand-1", "job-1")).rejects.toBeInstanceOf(
        AppError,
      );
    });
  });

  describe("moveStage", () => {
    it("deve mover a candidatura de etapa", async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          job_candidates: {
            findUnique: jest.fn().mockResolvedValue({
              id: "app-1",
              job_id: "job-1",
              current_stage: { name: "Applied" },
              job: { recruiter_id: "rec-1" },
            }),
            update: jest.fn().mockResolvedValue({ id: "app-1" }),
          },
          job_stages: {
            findUnique: jest.fn().mockResolvedValue({
              id: "stage-2",
              job_id: "job-1",
              name: "Interview",
            }),
          },
          job_candidate_history: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.moveStage({
        applicationId: "app-1",
        toStageId: "stage-2",
        recruiterId: "rec-1",
      });

      expect(result).toEqual({ id: "app-1" });
    });

    it("deve falhar se a candidatura não existir", async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          job_candidates: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        });
      });

      await expect(
        service.moveStage({
          applicationId: "app-x",
          toStageId: "stage-2",
          recruiterId: "rec-1",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("deve falhar se o recruiter não for dono da vaga", async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          job_candidates: {
            findUnique: jest.fn().mockResolvedValue({
              id: "app-1",
              job_id: "job-1",
              current_stage: { name: "Applied" },
              job: { recruiter_id: "rec-2" },
            }),
          },
        });
      });

      await expect(
        service.moveStage({
          applicationId: "app-1",
          toStageId: "stage-2",
          recruiterId: "rec-1",
        }),
      ).rejects.toBeInstanceOf(ForbiddenError);
    });
  });

  describe("evaluateApplication", () => {
    it("deve avaliar a candidatura", async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          job_candidates: {
            findUnique: jest.fn().mockResolvedValue({
              id: "app-1",
              rating: null,
              notes: null,
              job: { recruiter_id: "rec-1" },
              current_stage_id: "stage-1",
            }),
            update: jest.fn().mockResolvedValue({ id: "app-1", rating: 5 }),
          },
          job_candidate_history: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.evaluateApplication({
        applicationId: "app-1",
        recruiterId: "rec-1",
        rating: 5,
        notes: "Ótimo candidato",
      });

      expect(result).toEqual({ id: "app-1", rating: 5 });
    });
  });

  describe("removeApplication", () => {
    it("deve remover a candidatura", async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return cb({
          job_candidates: {
            findUnique: jest.fn().mockResolvedValue({
              id: "app-1",
              job: { recruiter_id: "rec-1" },
              current_stage: { name: "Applied" },
            }),
            delete: jest.fn().mockResolvedValue({}),
          },
          job_candidate_history: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.removeApplication("app-1", "rec-1");

      expect(result).toBe(true);
    });
  });
});
