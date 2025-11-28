export interface RegisterCandidateDTO {
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  password: string;
  lgpd_consent: boolean;
}
