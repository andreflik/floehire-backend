import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas requisições. Tente novamente em alguns minutos.",
  },
});

export const candidateAuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas tentativas para ações de candidato. Tente novamente mais tarde.",
  },
});

export const recruiterAuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas tentativas para ações de recrutador. Tente novamente mais tarde.",
  },
});

export const candidateApplyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas tentativas de candidatura em pouco tempo. Tente novamente mais tarde.",
  },
});

export const recruiterActionsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas ações realizadas em pouco tempo. Tente novamente mais tarde.",
  },
});
