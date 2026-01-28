"use server";

import db from "@/server/db";
import { admin_users } from "@/server/db/schema/user";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

// export async function registerAdmin(formData: FormData) {
//   try {
//     const email = formData.get("email")?.toString().trim();
//     const password = formData.get("password")?.toString();
//     const name = "Default Admin";

//     if (!email || !password) {
//       return { success: false, message: "All fields are required" };
//     }

//     const existingUser = await db
//       .select({ id: admin_users.id })
//       .from(admin_users)
//       .where(eq(admin_users.email, email))
//       .limit(1);

//     if (existingUser.length > 0) {
//       return { success: false, message: "Email already registered" };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [newUser] = await db
//       .insert(admin_users)
//       .values({ email, name, password: hashedPassword })
//       .returning({ id: admin_users.id, email: admin_users.email });

//     return {
//       success: true,
//       message: "Account created successfully",
//       user: newUser,
//     };
//   } catch (error) {
//     console.error(error);
//     return { success: false, message: "Something went wrong" };
//   }
// }

export async function login(formData: FormData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    const [user] = await db
      .select()
      .from(admin_users)
      .where(eq(admin_users.email, email))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: "User with this email is not existing",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid password. Please try again" };
    }

    return {
      success: true,
      message: "Login successful",
      user: { id: user.id, email: user.email },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}
