

import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "Remote",
    },

    salary: {
      type: String,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },

    experienceLevel: {
      type: String,
      enum: ["entry-level", "mid-level", "senior", "executive"],
      default: "mid-level",
    },

    applicationDeadline: {
      type: Date,
    },

    requirements: {
      type: String,
    },

    skills: {
      type: String,
    },

    isClosed: {
      type: Boolean,
      default: false,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "reviewed", "shortlisted", "rejected", "accepted"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);