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

  escolaridade?: string;
  curso?: string;
  instituicao?: string;
  ano_conclusao?: string;
  certificacoes?: string;
  idiomas?: string;

  portfolio_file?: any;
  portfolio_link?: string;

  lgpd_consent: boolean;

  experiences?: {
    job_title: string;
    start_date: string;
    end_date: string;
    responsibilities: string;
  }[];
}
