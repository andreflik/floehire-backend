export function parseCV(text: string) {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  const phoneMatch = text.match(/(\+55\s?)?\(?\d{2}\)?\s?\d{4,5}-?\d{4}/);

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const full_name = lines[0];

  return {
    full_name,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
  };
}
