import { LinkedInProvider } from "@/infra/oauth/LinkedInProvider";

export class LinkedInCandidateAuthService {
  static getRedirectUrl() {
    if (!process.env.LINKEDIN_CLIENT_ID) {
      throw new Error("LinkedIn OAuth não configurado");
    }

    return LinkedInProvider.getAuthUrl();
  }

  static async handleCallback(code: string) {
    const accessToken = await LinkedInProvider.getAccessToken(code);
    const profile = await LinkedInProvider.getUserProfile(accessToken);

    // 🚧 FUTURO:
    // - Verificar se candidate existe pelo email
    // - Criar candidate se não existir
    // - Gerar access_token + refresh_token
    // - Retornar tokens

    return profile;
  }
}
