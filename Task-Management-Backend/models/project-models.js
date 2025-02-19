import { Schema, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Optional: Add index on user and name for faster queries
ProjectSchema.index({ user: 1 });
ProjectSchema.index({ name: 1 });

// Ensure unique project name per user
ProjectSchema.index({ user: 1, name: 1 }, { unique: true });

export default model("Project", ProjectSchema);
