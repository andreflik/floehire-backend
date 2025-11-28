export interface CandidateResponseDTO {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  created_at: Date;
}
