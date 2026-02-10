import JobService from "@/application/services/JobService";
import prisma from "@/prisma";

jest.mock("@/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    jobs: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    job_stages: {
      create: jest.fn(),
    },
  },
}));

describe("JobService", () => {
  let service: JobService;

  beforeEach(() => {
    service = new JobService();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar uma vaga com sucesso", async () => {
      const recruiterId = "recruiter-123";
      const payload = {
        title: "Dev Backend",
        description: "Node + TS",
        city: "Salvador",
        state: "BA",
      };

      (prisma as any).$transaction.mockImplementation(async (cb: any) => {
        return cb({
          jobs: {
            create: jest.fn().mockResolvedValue({
              id: "job-1",
              title: "Dev Backend",
            }),
          },
          job_stages: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.create(recruiterId, payload as any);

      expect(result).toHaveProperty("id", "job-1");
      expect(result.title).toBe("Dev Backend");
    });
  });

  describe("listByRecruiter", () => {
    it("deve listar vagas do recruiter", async () => {
      const recruiterId = "recruiter-123";

      (prisma.jobs.findMany as jest.Mock).mockResolvedValue([
        { id: "job-1", recruiter_id: recruiterId, title: "Dev 1" },
        { id: "job-2", recruiter_id: recruiterId, title: "Dev 2" },
      ]);

      const result = await service.listByRecruiter(recruiterId);

      expect(prisma.jobs.findMany).toHaveBeenCalledWith({
        where: {
          recruiter_id: recruiterId,
          status: { not: "ARCHIVED" },
        },
        orderBy: { created_at: "desc" },
      });

      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("deve retornar a vaga quando existir", async () => {
      const recruiterId = "recruiter-123";
      const jobId = "job-1";

      (prisma.jobs.findFirst as jest.Mock).mockResolvedValue({
        id: jobId,
        recruiter_id: recruiterId,
        title: "Dev Backend",
      });

      const result = await service.getById(jobId, recruiterId);

      expect(result.id).toBe(jobId);
    });

    it("deve lançar erro quando a vaga não existir", async () => {
      (prisma.jobs.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getById("job-inexistente", "recruiter-123"),
      ).rejects.toMatchObject({ code: "JOB_NOT_FOUND" });
    });
  });

  describe("update", () => {
    it("deve atualizar a vaga com sucesso", async () => {
      const recruiterId = "recruiter-123";
      const jobId = "job-1";

      (prisma.jobs.findFirst as jest.Mock).mockResolvedValue({
        id: jobId,
        recruiter_id: recruiterId,
      });

      (prisma.jobs.update as jest.Mock).mockResolvedValue({
        id: jobId,
        title: "Novo título",
      });

      const result = await service.update(jobId, recruiterId, {
        title: "Novo título",
      } as any);

      expect(prisma.jobs.update).toHaveBeenCalled();
      expect(result.title).toBe("Novo título");
    });
  });

  describe("delete", () => {
    it("deve arquivar a vaga com sucesso", async () => {
      const recruiterId = "recruiter-123";
      const jobId = "job-1";

      (prisma.jobs.findFirst as jest.Mock).mockResolvedValue({
        id: jobId,
        recruiter_id: recruiterId,
      });

      (prisma.jobs.update as jest.Mock).mockResolvedValue({ id: jobId });

      await service.delete(jobId, recruiterId);

      expect(prisma.jobs.update).toHaveBeenCalledWith({
        where: { id: jobId },
        data: { status: "ARCHIVED" },
      });
    });
  });

  describe("countPublic", () => {
    it("deve retornar o total de vagas públicas", async () => {
      (prisma.jobs.count as jest.Mock).mockResolvedValue(5);

      const total = await service.countPublic();

      expect(total).toBe(5);
    });
  });
});
