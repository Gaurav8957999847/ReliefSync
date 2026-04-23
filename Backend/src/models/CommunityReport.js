import mongoose from "mongoose";

const communityReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    rawText: {
      type: String,
      default: "",
    },
    pdfPath: String,
    aiExtractedData: {
      type: Object,
      default: null,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["raw", "processing", "processed"],
      default: "raw",
    },
  },
  { timestamps: true },
);

const CommunityReport = mongoose.model(
  "CommunityReport",
  communityReportSchema,
);
export default CommunityReport;
