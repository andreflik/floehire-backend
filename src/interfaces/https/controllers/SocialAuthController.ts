import { Request, Response } from "express";
import { LinkedInCandidateAuthService } from "@/application/services/LinkedInCandidateAuthService";

export class SocialAuthController {
  static redirectToLinkedIn(req: Request, res: Response) {
    try {
      const url = LinkedInCandidateAuthService.getRedirectUrl();
      return res.redirect(url);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async linkedInCallback(req: Request, res: Response) {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json({ message: "Código do LinkedIn não informado" });
    }

    try {
      const profile = await LinkedInCandidateAuthService.handleCallback(code);

      // Por enquanto: só devolve o profile
      return res.json({
        message: "Login com LinkedIn (candidate) recebido com sucesso",
        profile,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erro ao autenticar com LinkedIn" });
    }
  }
}
