import { Schema, model } from "mongoose";

interface User {
  _id: string;
  userName: string;
  role: string;
  phoneNumber: string;
  password: string;
  accessToken: string;
}

const UserSchema = new Schema<User>({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN", "WORKER", "UNKNOWN"],
    default: "UNKNOWN",
  },
  accessToken: {
    type: String,
  },
});

const User = model<User>("User", UserSchema);

export default User;
