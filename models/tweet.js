import mongoose from "mongoose";
const TweetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: { type: String, required: true },
    likes: {
      type: Number,
      default: 0,
    },
    likedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Tweet", TweetSchema);
