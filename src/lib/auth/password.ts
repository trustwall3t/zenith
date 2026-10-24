import bcrypt from "bcrypt";

/** Laravel / PHP bcrypt uses `$2y$`; Node `bcrypt` expects `$2a$` (same algorithm). */
export function normalizeBcryptHash(stored: string): string {
  if (stored.startsWith("$2y$")) {
    return `$2a$${stored.slice(4)}`;
  }
  if (stored.startsWith("$2b$")) {
    return `$2a$${stored.slice(4)}`;
  }
  return stored;
}

export function describePasswordHash(stored: string): {
  prefix: string;
  length: number;
  looksLikeBcrypt: boolean;
  laravelStyle: boolean;
} {
  const prefix = stored.slice(0, 7);
  return {
    prefix,
    length: stored.length,
    looksLikeBcrypt: /^\$2[abxy]\$\d{2}\$/.test(stored),
    laravelStyle: stored.startsWith("$2y$"),
  };
}

export async function verifyPassword(
  plain: string,
  storedHash: string,
): Promise<boolean> {
  const normalized = normalizeBcryptHash(storedHash.trim());
  if (!/^\$2[abxy]\$\d{2}\$/.test(normalized)) {
    return false;
  }
  return bcrypt.compare(plain, normalized);
}
