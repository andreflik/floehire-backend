import {
  job_contract_type,
  job_work_model,
  job_hire_type,
} from "@prisma/client";

export interface UpdateJobDTO {
  title?: string;
  description?: string | null;

  seniority?: string | null;
  contract_type?: job_contract_type | null;
  work_model?: job_work_model | null;

  hire_type?: job_hire_type | null;
  city?: string | null;
  state?: string | null;

  salary_min?: number | null;
  salary_max?: number | null;

  deadline?: string | null;
}
