"use client";

// src/app/(app)/bookings/flights/page.jsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Clock, ChevronLeft, ArrowRight, ChevronDown,
  ChevronUp, Luggage, AlertCircle, SlidersHorizontal,
  X, Plus, User, Mail, Phone, CheckCircle2, Loader2, Shield
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ─── Ref resolver ─────────────────────────────────────────────────────────────
function byRef(arr, ref) {
  if (!arr || !ref) return null;
  return arr[ref - 1] ?? arr.find((x) => x.id === ref) ?? null;
}

const cabinLabels = { Y: "Economy", S: "Premium Economy", C: "Business", F: "First", W: "Premium Economy" };

function fmtDuration(mins) {
  if (!mins) return "";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function fmtTime(t) { return t ? t.slice(0, 5) : "—"; }

function parseLeg(legDesc, scheduleDescs) {
  if (!legDesc) return null;
  const schedules = (legDesc.schedules || []).map((s) => byRef(scheduleDescs, s.ref)).filter(Boolean);
  const first = schedules[0];
  const last  = schedules[schedules.length - 1];
  return {
    elapsedTime: legDesc.elapsedTime,
    stops: schedules.length - 1,
    departure: { airport: first?.departure?.airport ?? "—", time: fmtTime(first?.departure?.time), terminal: first?.departure?.terminal },
    arrival:   { airport: last?.arrival?.airport   ?? "—", time: fmtTime(last?.arrival?.time),   terminal: last?.arrival?.terminal   },
    carrier:       first?.carrier?.marketing ?? first?.carrier?.operating ?? "—",
    flightNumber:  first ? `${first.carrier?.marketing ?? ""}${first.carrier?.marketingFlightNumber ?? ""}` : "—",
    cabin:         cabinLabels[schedules[0]?.carrier?.cabinCode ?? "Y"] ?? "Economy",
    equipment:     first?.carrier?.equipment,
    schedules,
  };
}

function parseItinerary(itin, data) {
  const { scheduleDescs, legDescs, baggageAllowanceDescs } = data;
  const pricing     = itin.pricingInformation?.[0];
  const fare        = pricing?.fare;
  const passengerInfo = fare?.passengerInfoList?.[0]?.passengerInfo;
  const totalFare   = fare?.totalFare;
  const paxFare     = passengerInfo?.passengerTotalFare;
  const legs        = (itin.legs || []).map((l) => parseLeg(byRef(legDescs, l.ref), scheduleDescs)).filter(Boolean);
  const baggageRef  = passengerInfo?.baggageInformation?.[0]?.allowance?.ref;
  const baggage     = baggageRef ? byRef(baggageAllowanceDescs, baggageRef) : null;
  const baggageLabel = baggage ? (baggage.weight ? `${baggage.weight}kg` : baggage.pieces ? `${baggage.pieces}pc` : null) : null;
  return {
    id: itin.id,
    legs,
    currency:      totalFare?.currency ?? paxFare?.currency ?? "GBP",
    totalPrice:    totalFare?.totalPrice ?? paxFare?.totalFare ?? 0,
    baseFare:      paxFare?.baseFareAmount ?? totalFare?.baseFareAmount ?? 0,
    taxes:         paxFare?.totalTaxAmount ?? totalFare?.totalTaxAmount ?? 0,
    carrier:       fare?.validatingCarrierCode ?? legs[0]?.carrier ?? "—",
    nonRefundable: passengerInfo?.nonRefundable ?? true,
    baggageLabel,
    lastTicketDate: fare?.lastTicketDate,
  };
}

// ─── Leg row ──────────────────────────────────────────────────────────────────
function LegRow({ leg }) {
  return (
    <div className="flex items-center gap-4 flex-1">
      <div className="text-center min-w-[64px]">
        <p className="text-xl font-bold text-gray-900">{leg.departure.time}</p>
        <p className="text-xs font-semibold text-gray-500">{leg.departure.airport}</p>
        {leg.departure.terminal && <p className="text-xs text-gray-400">T{leg.departure.terminal}</p>}
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <p className="text-xs text-gray-400">{fmtDuration(leg.elapsedTime)}</p>
        <div className="w-full flex items-center gap-1">
          <div className="flex-1 h-px bg-gray-200" />
          <Plane size={12} className="text-gray-400 rotate-90" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <p className="text-xs text-gray-400">{leg.stops === 0 ? "Direct" : `${leg.stops} stop${leg.stops > 1 ? "s" : ""}`}</p>
      </div>
      <div className="text-center min-w-[64px]">
        <p className="text-xl font-bold text-gray-900">{leg.arrival.time}</p>
        <p className="text-xs font-semibold text-gray-500">{leg.arrival.airport}</p>
        {leg.arrival.terminal && <p className="text-xs text-gray-400">T{leg.arrival.terminal}</p>}
      </div>
    </div>
  );
}

// ─── Flight card ──────────────────────────────────────────────────────────────
function FlightCard({ itin, index, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.6) }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">{itin.carrier}</span>
          </div>
          <div className="flex-1 space-y-3 min-w-0">
            {itin.legs.map((leg, i) => (
              <div key={i}>
                {i > 0 && <div className="flex items-center gap-2 my-2"><div className="flex-1 border-t border-dashed border-gray-200" /><span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Return</span><div className="flex-1 border-t border-dashed border-gray-200" /></div>}
                <LegRow leg={leg} />
              </div>
            ))}
          </div>
          <div className="flex-shrink-0 text-right ml-4">
            <p className="text-2xl font-bold text-gray-900">
              {itin.currency} {itin.totalPrice.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{itin.nonRefundable ? "Non-refundable" : "Refundable"}</p>
            <button onClick={() => onSelect(itin)}
              className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
              Select <ArrowRight size={13} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {itin.legs[0] && <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500">{itin.legs[0].cabin}</span>}
          {itin.baggageLabel && <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center gap-1"><Luggage size={11} /> {itin.baggageLabel}</span>}
          {itin.nonRefundable && <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center gap-1"><AlertCircle size={11} /> Non-refundable</span>}
          {itin.lastTicketDate && <span className="text-xs text-gray-400 ml-auto">Book by {itin.lastTicketDate}</span>}
        </div>
      </div>
      <div className="border-t border-gray-100">
        <button onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
          <span>Fare breakdown</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="px-5 pb-4 space-y-2">
                {[["Base Fare", itin.baseFare], ["Taxes & Fees", itin.taxes]].map(([label, amount]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{itin.currency} {Number(amount).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                  <span>Total</span><span>{itin.currency} {itin.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Stripe payment step (inside Elements) ────────────────────────────────────
function StripePaymentForm({ itin, contact, passengers, searchParams, onSuccess, onBack }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying,   setPaying]   = useState(false);
  const [error,    setError]    = useState(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setPaying(true);

    try {
      // 1. Create PaymentIntent + booking record
      const res = await fetch("/api/flight/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact.email, phone: contact.phone, passengers, itinerary: itin, searchParams }),
      });

      const data = await res.json();
      if (!data.clientSecret) throw new Error(data.error || "Could not initialise payment");

      // 2. Confirm card with Stripe
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card, billing_details: { email: contact.email } },
      });

      // 3. Update booking status
      const status = result.error ? "failed" : "succeeded";
      await fetch("/api/flight/book", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: data.bookingId, status }),
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Charge summary */}
      <div className="rounded-2xl bg-gray-900 text-white p-5">
        <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Total Charge</p>
        <p className="text-4xl font-bold mb-1">
          {itin.currency} {itin.totalPrice.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
        </p>
        <div className="flex gap-4 mt-3 text-xs text-white/40">
          <span>Base: {itin.currency} {itin.baseFare.toFixed(2)}</span>
          <span>·</span>
          <span>Tax: {itin.currency} {itin.taxes.toFixed(2)}</span>
        </div>
        {itin.nonRefundable && (
          <p className="mt-3 text-xs text-amber-300 flex items-center gap-1.5">
            <AlertCircle size={12} /> This fare is non-refundable
          </p>
        )}
      </div>

      {/* Card element */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Card Details</label>
        <div className="border border-gray-200 rounded-xl px-4 py-3.5 bg-white focus-within:border-gray-900 transition-colors">
          <CardElement options={{
            hidePostalCode: true,
            style: {
              base: { fontSize: "15px", color: "#111827", fontFamily: "inherit", "::placeholder": { color: "#9ca3af" } },
              invalid: { color: "#ef4444" },
            },
          }} />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {/* Trust line */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Shield size={13} className="text-emerald-500" />
        Secured by Stripe · 256-bit SSL encryption
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onBack} disabled={paying}
          className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-40">
          Back
        </button>
        <button onClick={handlePay} disabled={paying || !stripe}
          className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {paying
            ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
            : <>Pay {itin.currency} {itin.totalPrice.toFixed(2)} <ArrowRight size={14} /></>
          }
        </button>
      </div>
    </div>
  );
}

// ─── Booking modal — 3 steps: Contact → Passengers → Payment ─────────────────
function BookingModal({ itin, searchParams, onClose }) {
  const [step,       setStep]       = useState(0);  // 0 contact | 1 passengers | 2 payment | 3 success
  const [contact,    setContact]    = useState({ email: "", phone: "" });
  const [passengers, setPassengers] = useState([{ title: "Mr", firstName: "", lastName: "", type: "Adult" }]);
  const [errors,     setErrors]     = useState({});

  const updatePassenger = (i, field, val) => {
    const p = [...passengers]; p[i][field] = val; setPassengers(p);
  };
  const addPassenger    = () => setPassengers([...passengers, { title: "Mr", firstName: "", lastName: "", type: "Adult" }]);
  const removePassenger = (i) => setPassengers(passengers.filter((_, idx) => idx !== i));

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!contact.email.trim() || !/\S+@\S+\.\S+/.test(contact.email)) e.email = "Valid email required";
      if (!contact.phone.trim()) e.phone = "Phone required";
    }
    if (s === 1) {
      passengers.forEach((p, i) => {
        if (!p.firstName.trim()) e[`fn${i}`] = "Required";
        if (!p.lastName.trim())  e[`ln${i}`] = "Required";
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => s + 1); };

  const stepLabels = ["Contact", "Passengers", "Payment"];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">
              {step === 3 ? "Booking Confirmed" : "Book Your Flight"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {itin.legs[0]?.departure.airport} → {itin.legs[itin.legs.length - 1]?.arrival.airport} · {itin.carrier}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
            <X size={16} />
          </button>
        </div>

        {/* Step indicators */}
        {step < 3 && (
          <div className="flex items-center px-6 py-3 border-b border-gray-100 gap-0 flex-shrink-0">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    step > i ? "bg-emerald-500 text-white" : step === i ? "bg-gray-900 text-white scale-110" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step > i ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === i ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && <div className={`flex-1 h-px mx-2 ${step > i ? "bg-emerald-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Step 0: Contact ── */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">Your Contact Details</h3>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+44 7700 000000"
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors" />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* ── Step 1: Passengers ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Passenger Details</h3>
                <button onClick={addPassenger}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition">
                  <Plus size={12} /> Add
                </button>
              </div>
              {passengers.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">{i + 1}</div>
                      <span className="text-sm font-medium text-gray-700">
                        {p.firstName ? `${p.title} ${p.firstName} ${p.lastName}` : `Passenger ${i + 1}`}
                      </span>
                    </div>
                    {i > 0 && (
                      <button onClick={() => removePassenger(i)} className="text-gray-400 hover:text-red-500 transition"><X size={14} /></button>
                    )}
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {[["Title", "title", "select", ["Mr","Ms","Mrs","Dr"]], ["Type", "type", "select", ["Adult","Child","Infant"]]].map(([label, field, , opts]) => (
                      <div key={field}>
                        <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                        <select value={p[field]} onChange={(e) => updatePassenger(i, field, e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-900 bg-white">
                          {opts.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                    {[["First Name", "firstName"], ["Last Name", "lastName"]].map(([label, field]) => (
                      <div key={field}>
                        <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                        <input type="text" value={p[field]} onChange={(e) => updatePassenger(i, field, e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-900" />
                        {errors[`${field === "firstName" ? "fn" : "ln"}${i}`] && (
                          <p className="text-red-500 text-xs mt-0.5">{errors[`${field === "firstName" ? "fn" : "ln"}${i}`]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                itin={itin}
                contact={contact}
                passengers={passengers}
                searchParams={searchParams}
                onSuccess={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            </Elements>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="text-center py-6 space-y-5">
              <div className="h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Payment Successful!</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  Your flight has been booked. A confirmation has been sent to <strong>{contact.email}</strong>.
                </p>
              </div>
              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2 text-sm">
                {itin.legs.map((leg, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-500">{i === 0 ? "Outbound" : "Return"}</span>
                    <span className="font-semibold text-gray-900">{leg.departure.airport} → {leg.arrival.airport} · {leg.departure.time}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex items-center justify-between font-semibold">
                  <span className="text-gray-700">Total Paid</span>
                  <span className="text-gray-900">{itin.currency} {itin.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Carrier</span><span>{itin.carrier}</span>
                </div>
              </div>
              <button onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition">
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer nav (steps 0 + 1) */}
        {step < 2 && (
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                Back
              </button>
            )}
            <button onClick={next}
              className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Filter panel ─────────────────────────────────────────────────────────────
function FilterPanel({ itineraries, filters, onChange, onClose }) {
  const maxPrice = Math.max(...itineraries.map((i) => i.totalPrice), 0);
  return (
    <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
      className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-100 shadow-2xl z-50 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition"><X size={18} /></button>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Direct flights only</label>
        <button onClick={() => onChange({ ...filters, directOnly: !filters.directOnly })}
          className={`h-6 w-11 rounded-full transition-colors ${filters.directOnly ? "bg-gray-900" : "bg-gray-200"}`}>
          <div className={`h-5 w-5 bg-white rounded-full shadow transition-transform mx-0.5 ${filters.directOnly ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Max price</label>
          <span className="text-sm font-semibold text-gray-900">GBP {filters.maxPrice ?? Math.ceil(maxPrice)}</span>
        </div>
        <input type="range" min={0} max={Math.ceil(maxPrice)} value={filters.maxPrice ?? Math.ceil(maxPrice)}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-gray-900" />
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FlightResultsPage() {
  const router = useRouter();
  const [raw,          setRaw]         = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [itineraries,  setItineraries]  = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [filters,      setFilters]      = useState({ directOnly: false, maxPrice: null });
  const [sortBy,       setSortBy]       = useState("price");

  useEffect(() => {
    const saved  = sessionStorage.getItem("flightResults");
    const params = sessionStorage.getItem("flightSearchParams");
    if (saved)  setRaw(JSON.parse(saved));
    if (params) setSearchParams(JSON.parse(params));
  }, []);

  useEffect(() => {
    if (!raw?.groupedItineraryResponse) return;
    const data   = raw.groupedItineraryResponse;
    const parsed = [];
    for (const group of (data.itineraryGroups || [])) {
      for (const itin of (group.itineraries || [])) {
        try {
          const p = parseItinerary(itin, data);
          if (p.totalPrice > 0) parsed.push(p);
        } catch (err) { console.warn("Failed to parse itinerary", itin.id, err); }
      }
    }
    setItineraries(parsed);
    const max = Math.max(...parsed.map((i) => i.totalPrice), 0);
    setFilters((f) => ({ ...f, maxPrice: Math.ceil(max) }));
  }, [raw]);

  const displayed = itineraries
    .filter((i) => {
      if (filters.directOnly && i.legs.some((l) => l.stops > 0)) return false;
      if (filters.maxPrice != null && i.totalPrice > filters.maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price")    return a.totalPrice - b.totalPrice;
      if (sortBy === "duration") {
        const dur = (x) => x.legs.reduce((s, l) => s + (l.elapsedTime || 0), 0);
        return dur(a) - dur(b);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-3">
            <ChevronLeft size={14} /> Back to search
          </button>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {displayed.length} Flight{displayed.length !== 1 ? "s" : ""} Found
              </h1>
              {searchParams && (
                <p className="text-sm text-gray-400 mt-1">
                  {searchParams.origin} → {searchParams.destination}
                  {searchParams.returnDate ? " · Return" : " · One Way"}
                  {" · "}{searchParams.departureDate}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none">
                <option value="price">Cheapest first</option>
                <option value="duration">Fastest first</option>
              </select>
              <button onClick={() => setFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition">
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* States */}
        {!raw && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg mb-4">No search results.</p>
            <button onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-700 transition">
              New Search
            </button>
          </div>
        )}
        {raw && displayed.length === 0 && itineraries.length === 0 && (
          <div className="text-center py-24">
            <Plane size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No flights found</p>
            <p className="text-gray-400 text-sm mb-6">Try different dates or airports</p>
            <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-700 transition">New Search</button>
          </div>
        )}
        {displayed.length === 0 && itineraries.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No flights match your filters.</p>
            <button onClick={() => setFilters({ directOnly: false, maxPrice: null })} className="mt-3 text-sm text-gray-900 underline">Clear filters</button>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {displayed.map((itin, i) => (
            <FlightCard key={itin.id} itin={itin} index={i} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setFilterOpen(false)} />
            <FilterPanel itineraries={itineraries} filters={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} />
          </>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {selected && (
          <BookingModal itin={selected} searchParams={searchParams} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}