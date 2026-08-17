const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied"
    },
    notes: { type: String },
    dateApplied: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
module.exports = JobApplication;