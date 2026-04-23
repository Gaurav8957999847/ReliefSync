import mongoose from "mongoose";

const summaryReportSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityReport",
      required: true,
    },
    needId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Need",
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    summaryType: {
      type: String,
      enum: ["urgent_need", "assignment_summary"],
      required: true,
    },
    generatedText: {
      type: String,
      required: true,
    },
    generatedBy: {
      type: String,
      default: "openai",
    },
  },
  { timestamps: true },
);

const SummaryReport = mongoose.model("SummaryReport", summaryReportSchema);
export default SummaryReport;
