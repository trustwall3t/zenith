import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma";

const db = new PrismaClient();

async function main() {
  const email = process.env.CHECK_EMAIL ?? "support@zenithgrowth.com";
  const password = process.env.CHECK_PASSWORD;

  const admins = await db.admin.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
  });
  console.log("DATABASE_URL host:", process.env.DATABASE_URL?.replace(/:[^:@/]+@/, ":***@"));
  console.log("Admin rows:", admins.length);
  for (const a of admins) {
    console.log(" -", a.email, a.name);
  }

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin) {
    console.log(`No admin with email: ${email}`);
    return;
  }
  console.log(`Found admin id=${admin.id}`);

  if (password) {
    const ok = await bcrypt.compare(password, admin.password);
    console.log("Password check:", ok ? "OK" : "FAIL");
  }
}

main()
  .finally(() => db.$disconnect());
