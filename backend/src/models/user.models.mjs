// import { Schema, model } from "mongoose";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//       index: true,
//     },
//     password: {
//       type: String,
//       required: [true, "password required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     avatar: {
//       type: String,
//       required: true,
//     },
   
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   //     const salt = await bcrypt.genSalt(10)
//   //     this.password = await bcrypt.hash(this.password, salt)
//   //     next()
//   // }
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       username: this.username,
//       email: this.email,
//       fullName: this.fullName,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//   );
// };

// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     { _id: this._id },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
//   );
// };
// userSchema.methods.generateResetPasswordToken = function () {
//   return jwt.sign(
//     { _id: this._id },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//   );
// };

// export const User = model("User", userSchema);
