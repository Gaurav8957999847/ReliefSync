import mongoose from "mongoose";

const needSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityReport",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    extractedData: {
      type: Object,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Need = mongoose.model("Need", needSchema);
export default Need;
