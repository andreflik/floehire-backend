const prisma = {
  $transaction: jest.fn(),

  candidates: {
    create: jest.fn(),
    update: jest.fn(),
  },

  candidate_experiences: {
    create: jest.fn(),
  },

  candidate_education: {
    create: jest.fn(),
  },

  password_reset_tokens: {
    deleteMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },

  candidate_refresh_tokens: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },

  recruiters: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },

  recruiter_refresh_tokens: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },

  jobs: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },

  job_stages: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },

  job_candidates: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  job_candidate_history: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

export default prisma;
