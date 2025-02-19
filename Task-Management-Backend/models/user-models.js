import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"; // Only import bcrypt once

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Pre-save hook to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      this.password = hashedPassword;
      next(); // Move on to save the user document
    } catch (error) {
      next(error); // If hashing fails, pass the error to the next middleware
    }
  } else {
    next(); // If password isn't modified, just move on to save the user
  }
});

export default model("User", userSchema); // Export the model
