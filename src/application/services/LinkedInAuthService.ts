import { LinkedInProvider } from "@/infra/oauth/LinkedInProvider";

export class LinkedInAuthService {
  static getRedirectUrl() {
    if (!process.env.LINKEDIN_CLIENT_ID) {
      throw new Error("LinkedIn OAuth não configurado");
    }

    return LinkedInProvider.getAuthUrl();
  }

  static async handleCallback(code: string) {
    // 1. Troca code por access token
    const accessToken = await LinkedInProvider.getAccessToken(code);

    // 2. Busca dados do usuário
    const profile = await LinkedInProvider.getUserProfile(accessToken);

    /**
     * profile deve vir algo como:
     * {
     *   sub: "...",
     *   name: "...",
     *   email: "...",
     *   picture: "..."
     * }
     */

    return profile;
  }
}
