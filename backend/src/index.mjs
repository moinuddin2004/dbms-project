import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import { connectDB } from "./db/db.mjs";
import { app } from "./app.mjs";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR PostgreSQL", error);
      throw error;
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("POSTGRESQL CONNECTION FAILED", err);
    // process.exit(1);
  });































  
// first approch to connect db
// import express from "express";
// const app = express();
// ;(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("ERROR mongo", error);
//       throw error;
//     });
//     app.listen(process.env.PORT || 3000, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("ERROR", error);
//     throw error;
//   }
// })();
