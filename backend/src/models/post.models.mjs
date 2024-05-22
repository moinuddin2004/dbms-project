// import mongoose, { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// const postSchema = new Schema(
//   {
//     thumbnail: {
//       type: String, //cloudinary url
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     owner: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//     likes: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       }
//     ]
//   },
//   {
//     timestamps: true,
//   }
// );
// postSchema.plugin(mongooseAggregatePaginate);
// export const Post = mongoose.model("Post", postSchema);
