import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import FlightBooking from "@/models/flightBooking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("📥 RAW BODY:", body);
    console.log("📥 passengers RAW:", body.passengers);
    console.log("📥 passengers TYPE:", typeof body.passengers);

    let {
      email,
      phone,
      passengers,
      itinerary,
      searchParams,
    } = body;

    // 🚨 STRICT VALIDATION — NO STRING ALLOWED
    if (typeof passengers === "string") {
      console.error("❌ passengers is STRING:", passengers);

      return new Response(
        JSON.stringify({
          error: "Passengers must be an array, not string",
          fix: "Remove JSON.stringify(passengers) from frontend",
          received: passengers,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🚨 MUST BE ARRAY
    if (!Array.isArray(passengers)) {
      return new Response(
        JSON.stringify({
          error: "Passengers must be an array",
          receivedType: typeof passengers,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🚨 VALIDATE EACH PASSENGER
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];

      if (typeof p !== "object" || p === null) {
        return new Response(
          JSON.stringify({
            error: `Invalid passenger at index ${i}`,
            value: p,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!p.firstName || !p.lastName) {
        return new Response(
          JSON.stringify({
            error: `Missing fields in passenger ${i}`,
            value: p,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    console.log("✅ CLEAN passengers:", passengers);

    // 🚨 REQUIRED FIELDS
    if (!email || !itinerary?.totalPrice) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const amountInPence = Math.round(itinerary.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: (itinerary.currency || "GBP").toLowerCase(),
      receipt_email: email,
      metadata: {
        itineraryId: String(itinerary.id),
        carrier: itinerary.carrier,
        origin: searchParams?.origin || "",
        destination: searchParams?.destination || "",
        passengers: String(passengers.length || 1),
      },
    });

    console.log("💾 SAVING passengers:", passengers);

    const booking = await FlightBooking.create({
      email,
      phone,
      passengers,
      itineraryId: String(itinerary.id),
      carrier: itinerary.carrier,
      origin: searchParams?.origin || "",
      destination: searchParams?.destination || "",
      departureDate: searchParams?.departureDate || "",
      returnDate: searchParams?.returnDate || "",
      cabin: itinerary.legs?.[0]?.cabin || "",
      currency: itinerary.currency || "GBP",
      baseFare: itinerary.baseFare,
      taxes: itinerary.taxes,
      totalAmount: itinerary.totalPrice,
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
    });

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        bookingId: booking._id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("🔥 FINAL ERROR:", err);

    return new Response(
      JSON.stringify({
        error: err.message || "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return new Response(
        JSON.stringify({ error: "Missing bookingId or status" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const booking = await FlightBooking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: status },
      { new: true }
    );

    if (!booking) {
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, paymentStatus: booking.paymentStatus }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("🔥 PATCH ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}