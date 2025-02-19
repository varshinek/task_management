import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    name: { type: String, required: true },
    deadline: { 
      type: Date, 
      validate: {
        validator: (value) => !value || value > Date.now(),
        message: "Deadline must be a future date",
      },
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });

export default model("Task", TaskSchema);
