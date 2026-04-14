// src/app/api/flight/book/route.js
// ─── Creates a Stripe PaymentIntent for a flight booking ─────────────────────

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ── Inline schema — add a proper model file if you want admin panel visibility
const FlightBookingSchema = new mongoose.Schema(
  {
    // Contact
    email:     { type: String, required: true },
    phone:     { type: String, required: true },
    // Passengers
    passengers: [
      {
        title:     String,
        firstName: String,
        lastName:  String,
        type:      String, // Adult / Child / Infant
      },
    ],
    // Flight details (from Sabre)
    itineraryId:    { type: String },
    carrier:        { type: String },
    origin:         { type: String },
    destination:    { type: String },
    departureDate:  { type: String },
    returnDate:     { type: String },
    cabin:          { type: String },
    // Pricing
    currency:       { type: String, default: "GBP" },
    baseFare:       { type: Number },
    taxes:          { type: Number },
    totalAmount:    { type: Number, required: true },
    // Stripe
    stripePaymentIntentId: { type: String },
    paymentStatus:  { type: String, default: "pending" }, // pending | succeeded | failed
  },
  { timestamps: true }
);

const FlightBooking =
  mongoose.models.FlightBooking ||
  mongoose.model("FlightBooking", FlightBookingSchema);

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      email, phone, passengers,
      itinerary, searchParams,
    } = body;

    if (!email || !itinerary?.totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Amount in pence (Stripe requires smallest currency unit)
    const amountInPence = Math.round(itinerary.totalPrice * 100);

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: (itinerary.currency || "GBP").toLowerCase(),
      receipt_email: email,
      metadata: {
        itineraryId: String(itinerary.id),
        carrier:     itinerary.carrier,
        origin:      searchParams?.origin      || "",
        destination: searchParams?.destination || "",
        passengers:  String(passengers?.length || 1),
      },
      description: `Flight booking — ${searchParams?.origin ?? "?"} → ${searchParams?.destination ?? "?"} · ${itinerary.carrier}`,
    });

    // Save booking record
    const booking = await FlightBooking.create({
      email,
      phone,
      passengers: passengers || [],
      itineraryId:   String(itinerary.id),
      carrier:       itinerary.carrier,
      origin:        searchParams?.origin      || "",
      destination:   searchParams?.destination || "",
      departureDate: searchParams?.departureDate || "",
      returnDate:    searchParams?.returnDate    || "",
      cabin:         itinerary.legs?.[0]?.cabin  || "",
      currency:      itinerary.currency || "GBP",
      baseFare:      itinerary.baseFare,
      taxes:         itinerary.taxes,
      totalAmount:   itinerary.totalPrice,
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("Flight booking error:", err);
    return NextResponse.json(
      { error: err.message || "Booking failed" },
      { status: 500 }
    );
  }
}

// ── PATCH — update payment status after Stripe confirms ───────────────────────
export async function PATCH(req) {
  try {
    await connectDB();
    const { bookingId, status } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }

    const booking = await FlightBooking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: status },
      { new: true }
    );

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("Booking status update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//Need to work on followings: 
//1) FlightBooking validation failed: passengers.0: Cast to [string] failed for value "[\n' + ' {\n' + " title: 'Mr',\n" + " firstName: 'Shahryar',\n" + " lastName: 'Rauf',\n" + " type: 'Adult'\n" + ' }\n' + ']" (type string) at path "passengers.0" because of "CastError"
//This Error Fixing

//2) Filters not working, fix that
//3) When we type the Code or City name, it should show it as well