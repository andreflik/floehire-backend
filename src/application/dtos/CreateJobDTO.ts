export interface CreateJobDTO {
  title: string;
  description?: string;
  seniority?: string;
  work_model?: "ONSITE" | "HYBRID" | "REMOTE";
  contract_type?: "CLT" | "PJ";
  hire_type?: "REPLACEMENT" | "NEW_POSITION";
  city?: string;
  state?: string;
  salary_min?: number;
  salary_max?: number;
  deadline?: string;
}
