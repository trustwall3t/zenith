import { PrismaClient } from "../src/generated/prisma";
import { resolvePublicStorageUrl } from "../src/lib/public/storage-url";

const prisma = new PrismaClient();

async function main() {
  const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!s?.logoUrl) {
    console.log("No logoUrl in SiteSettings");
    return;
  }
  const next = resolvePublicStorageUrl(s.logoUrl);
  if (next && next !== s.logoUrl) {
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: { logoUrl: next },
    });
    console.log("Updated logoUrl:", next);
  } else {
    console.log("logoUrl already correct:", s.logoUrl);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
