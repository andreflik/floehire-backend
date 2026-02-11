import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Limpa tudo (ordem importa por FK)
  await prisma.job_candidate_history.deleteMany();
  await prisma.job_candidates.deleteMany();
  await prisma.job_stages.deleteMany();
  await prisma.jobs.deleteMany();
  await prisma.candidate_experiences.deleteMany();
  await prisma.candidate_education.deleteMany();
  await prisma.candidate_refresh_tokens.deleteMany();
  await prisma.recruiter_refresh_tokens.deleteMany();
  await prisma.candidates.deleteMany();
  await prisma.recruiters.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  // Recruiter
  const recruiter = await prisma.recruiters.create({
    data: {
      company_name: "FloeHire Tech",
      email: "recruiter@floehire.com",
      password_hash: passwordHash,
    },
  });

  // Candidates
  const candidate1 = await prisma.candidates.create({
    data: {
      full_name: "Alice Candidate",
      email: "alice@floehire.com",
      city: "Salvador",
      state: "BA",
      password_hash: passwordHash,
      lgpd_consent: true,
    },
  });

  const candidate2 = await prisma.candidates.create({
    data: {
      full_name: "Bob Candidate",
      email: "bob@floehire.com",
      city: "São Paulo",
      state: "SP",
      password_hash: passwordHash,
      lgpd_consent: true,
    },
  });

  // Jobs
  const job1 = await prisma.jobs.create({
    data: {
      recruiter_id: recruiter.id,
      title: "Backend Node.js",
      description: "Vaga para Node.js + TypeScript",
      city: "Salvador",
      state: "BA",
      status: "OPEN",
      work_model: "HYBRID",
      contract_type: "CLT",
      hire_type: "NEW_POSITION",
      seniority: "Pleno",
      salary_min: 5000,
      salary_max: 8000,
    },
  });

  const job2 = await prisma.jobs.create({
    data: {
      recruiter_id: recruiter.id,
      title: "Frontend React",
      description: "Vaga para React + Vite",
      city: "São Paulo",
      state: "SP",
      status: "OPEN",
      work_model: "REMOTE",
      contract_type: "PJ",
      hire_type: "REPLACEMENT",
      seniority: "Júnior",
      salary_min: 4000,
      salary_max: 6000,
    },
  });

  // Stages para job1
  const job1Applied = await prisma.job_stages.create({
    data: {
      job_id: job1.id,
      name: "Applied",
      stage_order: 1,
    },
  });

  const job1Interview = await prisma.job_stages.create({
    data: {
      job_id: job1.id,
      name: "Interview",
      stage_order: 2,
    },
  });

  const job1Hired = await prisma.job_stages.create({
    data: {
      job_id: job1.id,
      name: "Hired",
      stage_order: 3,
    },
  });

  // Stages para job2
  const job2Applied = await prisma.job_stages.create({
    data: {
      job_id: job2.id,
      name: "Applied",
      stage_order: 1,
    },
  });

  const job2Interview = await prisma.job_stages.create({
    data: {
      job_id: job2.id,
      name: "Interview",
      stage_order: 2,
    },
  });

  // Candidaturas
  const jc1 = await prisma.job_candidates.create({
    data: {
      job_id: job1.id,
      candidate_id: candidate1.id,
      current_stage_id: job1Applied.id,
    },
  });

  const jc2 = await prisma.job_candidates.create({
    data: {
      job_id: job1.id,
      candidate_id: candidate2.id,
      current_stage_id: job1Interview.id,
      rating: 4,
      notes: "Bom desempenho na entrevista técnica",
    },
  });

  // Histórico inicial
  await prisma.job_candidate_history.create({
    data: {
      job_candidate_id: jc1.id,
      from_stage_name: null,
      to_stage_name: "Applied",
      moved_by: "system",
      comment: "Candidatura criada",
    },
  });

  await prisma.job_candidate_history.create({
    data: {
      job_candidate_id: jc2.id,
      from_stage_name: "Applied",
      to_stage_name: "Interview",
      moved_by: "recruiter",
      comment: "Avançou para entrevista",
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log("👤 Recruiter: recruiter@floehire.com | senha: 123456");
  console.log("👤 Candidate: alice@floehire.com | senha: 123456");
  console.log("👤 Candidate: bob@floehire.com | senha: 123456");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
