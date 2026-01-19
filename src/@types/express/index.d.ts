import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: "recruiter" | "candidate";
    };
  }
}

export function Router() {
  throw new Error("Function not implemented.");
}
