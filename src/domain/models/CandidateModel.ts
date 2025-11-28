export interface CandidateModel {
  id: string;
  full_name: string;
  email: string;

  phone: string | null;
  city: string | null;
  state: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;

  password_hash: string;

  lgpd_consent: boolean;
  created_at: Date;
}
