import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed admin user
  const email = process.env.ADMIN_EMAIL || "admin@toilet-map.local";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log(`✓ Admin user seeded (${email})`);

  // Seed restrooms in downtown LA
  const restrooms = [
    {
      name: "Grand Central Market",
      latitude: 34.0511,
      longitude: -118.2489,
      address: "317 S Broadway, Los Angeles, CA 90013",
      accessType: "free",
      codeRequired: "no",
      accessibility: "accessible",
      note: "Restrooms in the back near Hill St entrance.",
      lastConfirmed: new Date("2024-12-01"),
    },
    {
      name: "The Last Bookstore",
      latitude: 34.0487,
      longitude: -118.2499,
      address: "453 S Spring St, Los Angeles, CA 90013",
      accessType: "customers",
      codeRequired: "no",
      accessibility: "limited",
      note: "Ask at the register. Second floor.",
      lastConfirmed: new Date("2024-11-15"),
    },
    {
      name: "Pershing Square",
      latitude: 34.0488,
      longitude: -118.2533,
      address: "532 S Olive St, Los Angeles, CA 90013",
      accessType: "free",
      codeRequired: "no",
      accessibility: "accessible",
      note: "Public restrooms near the fountain.",
      lastConfirmed: new Date("2024-10-20"),
    },
    {
      name: "LA Central Library",
      latitude: 34.0502,
      longitude: -118.2554,
      address: "630 W 5th St, Los Angeles, CA 90071",
      accessType: "free",
      codeRequired: "no",
      accessibility: "accessible",
      note: "Multiple floors. Cleanest on the upper levels.",
      lastConfirmed: new Date("2024-12-10"),
    },
    {
      name: "Starbucks – 7th & Fig",
      latitude: 34.0482,
      longitude: -118.2581,
      address: "735 S Figueroa St, Los Angeles, CA 90017",
      accessType: "customers",
      codeRequired: "yes",
      accessibility: "accessible",
      note: "Code on receipt. Single occupancy.",
      lastConfirmed: new Date("2024-11-28"),
    },
    {
      name: "Union Station",
      latitude: 34.0561,
      longitude: -118.2365,
      address: "800 N Alameda St, Los Angeles, CA 90012",
      accessType: "free",
      codeRequired: "no",
      accessibility: "accessible",
      note: "Large restrooms near the main hall.",
      lastConfirmed: new Date("2024-12-05"),
    },
    {
      name: "The Broad Museum",
      latitude: 34.0544,
      longitude: -118.2506,
      address: "221 S Grand Ave, Los Angeles, CA 90012",
      accessType: "free",
      codeRequired: "no",
      accessibility: "accessible",
      note: "Free admission. Restrooms on lobby level.",
      lastConfirmed: new Date("2024-11-10"),
    },
    {
      name: "Whole Foods – DTLA",
      latitude: 34.0457,
      longitude: -118.2555,
      address: "788 S Grand Ave, Los Angeles, CA 90017",
      accessType: "customers",
      codeRequired: "yes",
      accessibility: "accessible",
      note: "Ask for code at checkout.",
      lastConfirmed: new Date("2024-12-12"),
    },
    {
      name: "Little Tokyo – Japanese Village Plaza",
      latitude: 34.0497,
      longitude: -118.2395,
      address: "335 E 2nd St, Los Angeles, CA 90012",
      accessType: "free",
      codeRequired: "no",
      accessibility: "limited",
      note: "Small restroom near the plaza center.",
      lastConfirmed: new Date("2024-10-30"),
    },
    {
      name: "Crypto.com Arena – Public Area",
      latitude: 34.043,
      longitude: -118.2673,
      address: "1111 S Figueroa St, Los Angeles, CA 90015",
      accessType: "free",
      codeRequired: "no",
      accessibility: "accessible",
      note: "Available during events. Large facilities.",
      lastConfirmed: new Date("2024-11-20"),
    },
  ];

  for (const r of restrooms) {
    await prisma.restroom.create({ data: r });
  }
  console.log(`✓ ${restrooms.length} restrooms seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
