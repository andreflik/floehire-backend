import { job_status } from "@prisma/client";

export interface UpdateJobStatusDTO {
  status: job_status;
}
