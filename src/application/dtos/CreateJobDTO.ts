import {
  job_contract_type,
  job_work_model,
  job_hire_type,
} from "@prisma/client";

export interface CreateJobDTO {
  title: string;
  description?: string | null;

  seniority: string;
  contract_type: job_contract_type;
  work_model: job_work_model;

  hire_type?: job_hire_type | null;
  city?: string | null;
  state?: string | null;

  salary_min?: number | null;
  salary_max?: number | null;

  deadline?: string | null;
}
