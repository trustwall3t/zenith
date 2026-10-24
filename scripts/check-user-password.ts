/**
 * Compare a plain password against the hash stored in Postgres (from Laravel import).
 *
 * Usage:
 *   npx tsx scripts/check-user-password.ts --email you@example.com --password 'YourPassword'
 *
 * Does not print the full hash or password — only metadata and match yes/no.
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import {
  describePasswordHash,
  verifyPassword,
} from "../src/lib/auth/password";

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1 || i === process.argv.length - 1) return undefined;
  return process.argv[i + 1];
}

async function main() {
  const email = arg("--email");
  const password = arg("--password");

  if (!email) {
    console.error("Usage: npx tsx scripts/check-user-password.ts --email USER --password 'PASS'");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user with email: ${email}`);
    process.exit(1);
  }

  const meta = describePasswordHash(user.password);
  console.log("User:", user.email);
  console.log("zenithId:", user.zenithId);
  console.log("confirm:", user.confirm);
  console.log("isVerified:", user.isVerified);
  console.log("Hash prefix:", meta.prefix, "| length:", meta.length);
  console.log("Looks like bcrypt:", meta.looksLikeBcrypt);
  console.log("Laravel ($2y$) style:", meta.laravelStyle);

  if (!password) {
    console.log("\nPass --password '...' to test bcrypt.compare (same as login).");
    return;
  }

  const match = await verifyPassword(password, user.password);
  console.log("\nPassword matches hash:", match ? "YES" : "NO");

  if (!match && !meta.looksLikeBcrypt) {
    console.log(
      "Hash is not bcrypt — Laravel may have stored a different format; re-hash via reset password in this app.",
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
