import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: String,
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      enum: ["available", "busy", "on_assignment"],
      default: "available",
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;
