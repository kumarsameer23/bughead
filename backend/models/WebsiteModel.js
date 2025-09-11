// File: backend/models/WebsiteModel.js
import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    websiteUrl: { // ✅ Added new field for website URL
      type: String,
      required: true,
      unique: true, // Ensures each website URL is unique
    },
    repoLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Website = mongoose.model("Website", websiteSchema);

export default Website;