import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    needId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Need",
      required: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed"],
      default: "assigned",
    },
    notes: String,
  },
  { timestamps: true },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
