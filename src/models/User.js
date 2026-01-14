import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:{type: String, require: true, trim: true},
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: {type: String, require:true},
    phone: {type: String, default: "", trim: true},
    role: { type: String, enum: ["user", "admin"], default:"user"}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
