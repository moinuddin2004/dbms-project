// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.mjs";
import { PrismaClient } from "@prisma/client";

// export const connectDB = async () => {
//   try {
//     const response = await mongoose.connect(
//       `${process.env.MONGODB_URL}/${DB_NAME}`
//     );
//     // console.log(response);
//     console.log(
//       `\n MongoDB connected !!! DB HOST: ${response.connection.host}`
//     );
//   } catch (error) {
//     console.log("MONGODB CONNECTION FAILED", error);
//     exit(1);
//   }
// };

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL database successfully");
  } catch (error) {
    console.error("POSTGRESQL CONNECTION FAILED", error);
    process.exit(1); // Exit the process with failure code
  }
}

export { prisma, connectDB };
