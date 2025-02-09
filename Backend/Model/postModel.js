import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 1000,
    },
    img: {
      type: String,
    },
    likes: {
      //array of user id
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
