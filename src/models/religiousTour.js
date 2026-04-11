// src/models/religiousTour.js
import mongoose from "mongoose";

const InclusionsSchema = new mongoose.Schema(
  {
    visa: { type: Boolean, default: false },
    flights: { type: Boolean, default: false },
    hotel: { type: Boolean, default: false },
    transport: { type: Boolean, default: false },
  },
  { _id: false }
);

const ReligiousTourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    category: {
      type: String,
      enum: ["hajj", "umrah", "other"],
      required: true,
    },

    // Only used when category === "other" (e.g. "Christian", "Hindu", "Buddhist")
    religion: { type: String },

    destination: { type: String, required: true },

    // e.g. "14 Nights / 15 Days"
    duration: { type: String, required: true },

    // e.g. ["10 May 2025", "17 May 2025"]
    departureDates: [{ type: String }],

    startingPrice: { type: Number, required: true },

    currency: { type: String, default: "GBP" },

    inclusions: { type: InclusionsSchema, default: () => ({}) },

    description: { type: String },

    // Cloudinary URL or public path
    image: { type: String },

    featured: { type: Boolean, default: false },

    // e.g. "Limited Seats", "Early Bird", "Ramadan"
    tag: { type: String },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ReligiousTour ||
  mongoose.model("ReligiousTour", ReligiousTourSchema);
