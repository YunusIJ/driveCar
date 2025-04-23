import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
   userName: {
  type: String,
  required: false, 
  unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        
        return !this.facebookId;
      },
    },
    facebookId: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);




const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
