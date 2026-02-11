export class LinkedInProvider {
  static getAuthUrl() {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID || "",
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI || "",
      scope: "openid profile email",
      state: "floehire_linkedin",
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  static async getAccessToken(code: string) {
    const response = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI || "",
          client_id: process.env.LINKEDIN_CLIENT_ID || "",
          client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao obter access token do LinkedIn");
    }

    const data = await response.json();
    return data.access_token as string;
  }

  static async getUserProfile(accessToken: string) {
    const response = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao obter perfil do LinkedIn");
    }

    return response.json();
  }
}
