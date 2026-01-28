import db from "../index";
import { admin_users } from "../schema/user";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

async function AdminSeeder() {
  try {
    console.log("Seeding Admin User");

    const primary_password = "Admin@123";
    const password = await bcrypt.hash(primary_password, 10);

    await db.insert(admin_users).values({
      id: randomUUID(),
      email: "admin@speakup.com",
      password,
      role: "Admin",
    });
    console.log("Admin user seeded succefully");
    process.exit(0);
  } catch (error) {
    console.error("error seeding", error);
    process.exit(1);
  }
}

AdminSeeder();
