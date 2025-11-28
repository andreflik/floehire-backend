export interface RegisterCandidateDTO {
  full_name: string;
  email: string;
  password: string;

  phone?: string;
  city?: string;
  state?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;

  lgpd_consent: boolean;

  experience?: {
    job_title?: string;
    start_date?: string;
    end_date?: string;
    responsibilities?: string;
  };
}
