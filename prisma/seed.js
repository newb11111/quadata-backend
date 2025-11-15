import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Running PRODUCTION seed...");

  // 1. Create Admin User
  const adminEmail = "admin@quadata.com";
  const adminPassword = "123456";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("✔ Admin user created:", admin.email);

  // 2. Create Packages
  await prisma.package.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Influencer Package",
      packageType: "INFLUENCER",
      price: 0.00
    }
  });

  await prisma.package.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: "Advertiser Package",
      packageType: "ADVERTISER",
      price: 99.00
    }
  });

  await prisma.package.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: "Agent Package",
      packageType: "AGENT",
      price: 199.00
    }
  });

  console.log("✔ Packages inserted");
  console.log("🎉 Production seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
