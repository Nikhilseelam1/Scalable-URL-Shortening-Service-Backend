import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      trim: true,
    },
    ipHash: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    device: {
      type: String,
      default: "desktop",
    },
    referrer: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

analyticsSchema.index({ shortCode: 1 });
analyticsSchema.index({ createdAt: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;