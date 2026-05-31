import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../src/lib/db.js";
import User from "../src/models/User.js";

dotenv.config({ path: ".env.local" }); // ✅ ensure .env loads manually

(async () => {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await connectDB();

    const adminEmail = "admin@nottinghamtravel.com";
    const adminPassword = "admincontrol";
    const adminPhone = "03000000000";
    const adminName = "Super Admin";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:");
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`🧑‍💼 Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      phone: adminPhone,
      role: "admin",
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("-----------------------------------");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🧑‍💼 Role: admin`);
    console.log("-----------------------------------");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    mongoose.connection.close();
    process.exit(1);
  }
})();
