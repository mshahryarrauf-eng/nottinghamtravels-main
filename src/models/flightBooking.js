import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  title: String,
  firstName: String,
  lastName: String,
  type: String, // Adult / Child / Infant
});

const flightBookingSchema = new mongoose.Schema(
  {
    // Contact
    email: { type: String, required: true },
    phone: { type: String, required: true },

    // Passengers
    passengers: [passengerSchema],

    // Flight info
    itineraryId: String,
    carrier: String,
    origin: String,
    destination: String,
    departureDate: String,
    returnDate: String,
    cabin: String,

    // Pricing
    currency: { type: String, default: "GBP" },
    baseFare: Number,
    taxes: Number,
    totalAmount: { type: Number, required: true },

    // Payment
    stripePaymentIntentId: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.FlightBooking ||
  mongoose.model("FlightBooking", flightBookingSchema);