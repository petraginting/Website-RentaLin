import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["owner", "user"], default: "user" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userShema);

export default User;
