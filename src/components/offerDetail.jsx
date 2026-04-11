"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  CalendarDays, MapPin, Plane, Hotel, Tag, Clock, ArrowRight,
  ChevronLeft, ChevronRight, X, Plus, Users, Star, Shield,
  CheckCircle, Wifi, Coffee, Car, Globe
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { showAlert } from "@/components/common/mixin";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ─── Stripe step ──────────────────────────────────────────────────────────────
function BookingStep({ selectedOffer, contact, guests, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);

  const totalAmount =
    selectedOffer.fareType === "Per Person"
      ? selectedOffer.amount * guests.length
      : selectedOffer.amount;

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsPaying(true);
    const res = await fetch("/api/offers/book-offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, guests, offerId: selectedOffer._id, amount: selectedOffer.amount, totalAmount, currency: selectedOffer.currency || "usd", fareType: selectedOffer.fareType }),
    });
    const data = await res.json();
    if (!data.clientSecret) { showAlert("error", "Payment initialization failed."); setIsPaying(false); return; }
    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(data.clientSecret, { payment_method: { card, billing_details: { email: contact.email } } });
    const status = result.error ? "failed" : "succeeded";
    await fetch("/api/offers/book-offer", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId: data.booking._id, status }) });
    if (result.error) { showAlert("error", "Payment failed: " + result.error.message); }
    else { showAlert("success", "Booking confirmed! 🎉"); onClose(); }
    setIsPaying(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-border p-5">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Total to Pay</p>
        <p className="text-3xl font-bold">{selectedOffer.currency} {totalAmount.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {selectedOffer.fareType === "Per Person"
            ? `${selectedOffer.currency} ${selectedOffer.amount} × ${guests.length} guest${guests.length > 1 ? "s" : ""}`
            : "Total package price"}
        </p>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Card Details</label>
        <div className="border border-border rounded-xl p-4 bg-muted/30">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      <button onClick={handlePayment} disabled={!stripe || !elements || isPaying}
        className="w-full py-3.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
        {isPaying
          ? <><span className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />Processing…</>
          : <>Pay {selectedOffer.currency} {totalAmount.toLocaleString()} <ArrowRight size={14} /></>
        }
      </button>
    </div>
  );
}

// ─── Guest card ───────────────────────────────────────────────────────────────
function GuestCard({ index, guest, updateGuest, removeGuest, errors, setErrors }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div onClick={() => setOpen(!open)} className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-muted/30 transition">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">{index + 1}</div>
          <span className="text-sm font-medium">
            {guest.firstName ? `${guest.title} ${guest.firstName} ${guest.lastName}` : `Guest ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {index > 0 && <button type="button" onClick={(e) => { e.stopPropagation(); removeGuest(index); }} className="text-muted-foreground hover:text-destructive transition"><X size={14} /></button>}
          <span className="text-muted-foreground text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
          {[["Title", "title", "select", ["Mr","Ms","Mrs","Dr"]], ["Type", "type", "select", ["Adult","Child"]]].map(([label, field, type, opts]) => (
            <div key={field}>
              <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
              <select value={guest[field]} onChange={(e) => updateGuest(index, field, e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {[["First Name", "firstName"], ["Last Name", "lastName"]].map(([label, field]) => (
            <div key={field}>
              <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
              <input type="text" value={guest[field]}
                onChange={(e) => { updateGuest(index, field, e.target.value); if (errors[`${field}${index}`]) setErrors((p) => ({ ...p, [`${field}${index}`]: "" })); }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              {errors[`${field}${index}`] && <p className="text-destructive text-xs mt-1">{errors[`${field}${index}`]}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Booking modal ────────────────────────────────────────────────────────────
function BookingModal({ offer, onClose }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [contact, setContact] = useState({ phone: "", email: "" });
  const [guests, setGuests] = useState([{ title: "Mr", firstName: "", lastName: "", type: "Adult" }]);

  const addGuest = () => setGuests([...guests, { title: "Mr", firstName: "", lastName: "", type: "Adult" }]);
  const removeGuest = (i) => setGuests(guests.filter((_, idx) => idx !== i));
  const updateGuest = (i, f, v) => { const g = [...guests]; g[i][f] = v; setGuests(g); };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!contact.phone.trim()) e.phone = "Required";
      if (!contact.email.trim()) e.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(contact.email)) e.email = "Invalid email";
    }
    if (s === 2) guests.forEach((g, i) => {
      if (!g.firstName.trim()) e[`firstName${i}`] = "Required";
      if (!g.lastName.trim()) e[`lastName${i}`] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const steps = ["Contact", "Guests", "Payment"];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
        className="bg-background w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div>
            <h2 className="font-semibold">Secure Booking</h2>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{offer.title}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition">
            <X size={16} />
          </button>
        </div>
        {/* Step indicators */}
        <div className="flex items-center px-6 py-3 border-b border-border gap-0">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-foreground text-background scale-110" : "bg-muted text-muted-foreground"
                }`}>
                  {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-2 transition-colors ${step > i + 1 ? "bg-emerald-500" : "bg-border"}`} />}
            </React.Fragment>
          ))}
        </div>
        {/* Content */}
        <div className="px-6 py-5 max-h-[55vh] overflow-y-auto space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Contact Information</h3>
              {[["Phone Number", "phone", "text", "+44 7700 000000"], ["Email Address", "email", "email", "you@example.com"]].map(([label, field, type, ph]) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <input type={type} value={contact[field]}
                    onChange={(e) => { setContact({ ...contact, [field]: e.target.value }); if (errors[field]) setErrors((p) => ({ ...p, [field]: "" })); }}
                    placeholder={ph}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  {errors[field] && <p className="text-destructive text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Guest Details</h3>
                <button type="button" onClick={addGuest} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition">
                  <Plus size={12} /> Add Guest
                </button>
              </div>
              {guests.map((g, i) => <GuestCard key={i} index={i} guest={g} updateGuest={updateGuest} removeGuest={removeGuest} errors={errors} setErrors={setErrors} />)}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/30 border border-border p-4 text-sm space-y-1.5">
                <p><span className="text-muted-foreground">Offer:</span> {offer.title}</p>
                <p><span className="text-muted-foreground">Contact:</span> {contact.phone} · {contact.email}</p>
                <p><span className="text-muted-foreground">Guests:</span> {guests.length}</p>
              </div>
              <Elements stripe={stripePromise}>
                <BookingStep selectedOffer={offer} contact={contact} guests={guests} onClose={onClose} />
              </Elements>
            </div>
          )}
        </div>
        {step < 3 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
            <button onClick={() => setStep((s) => s - 1)} disabled={step === 1}
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border border-border hover:bg-muted transition disabled:opacity-40">
              <ChevronLeft size={14} /> Back
            </button>
            <button onClick={() => { if (validate(step)) setStep((s) => s + 1); }}
              className="inline-flex items-center gap-1.5 text-sm px-6 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition">
              Continue <ChevronRight size={14} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Parallax Hero ────────────────────────────────────────────────────────────
function ParallaxHero({ images, title, type }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [current, setCurrent] = useState(0);
  const imgs = images || [];

  return (
    <div ref={ref} className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        {imgs.length > 0 ? (
          <Image src={imgs[current]} alt={title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </motion.div>

      {/* Image nav */}
      {imgs.length > 1 && (
        <>
          <button onClick={() => setCurrent((c) => (c - 1 + imgs.length) % imgs.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition z-10">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setCurrent((c) => (c + 1) % imgs.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition z-10">
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`} />
            ))}
          </div>
        </>
      )}

      {/* Title overlay */}
      <motion.div style={{ opacity }} className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10 z-10">
        <div className="max-w-6xl mx-auto">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
            type === "Flight" ? "bg-blue-500/20 text-blue-200 border border-blue-400/30"
            : type === "Hotel" ? "bg-amber-500/20 text-amber-200 border border-amber-400/30"
            : "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
          }`}>
            {type}
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight">{title}</h1>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Inclusion badge ──────────────────────────────────────────────────────────
const inclusionIcons = { wifi: Wifi, breakfast: Coffee, parking: Car, transfer: Car, visa: Globe, flight: Plane };

// ─── Main ─────────────────────────────────────────────────────────────────────
const OfferDetail = () => {
  const { slug } = useParams();
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    fetch(`/api/offers?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          let cats = data.offer.category || [];
          if (cats.length === 1 && typeof cats[0] === "string" && cats[0].startsWith("[")) {
            try { cats = JSON.parse(cats[0]); } catch { cats = []; }
          }
          setOffer({ ...data.offer, category: cats });
        } else setError(data.error || "Offer not found");
      })
      .catch(() => setError("Failed to fetch offer"))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
    </div>
  );

  if (error || !offer) return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div className="space-y-3">
        <p className="text-xl font-semibold">Offer not found</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  );

  const categories = Array.isArray(offer.category) ? offer.category : [];
  const hasDetails = offer.airline || offer.journeyType || offer.cabinClass || offer.hotelName || offer.rating;

  return (
    <div className="min-h-screen">
      {/* ── Parallax Hero ── */}
      <ParallaxHero images={offer.images} title={offer.title} type={offer.type} />

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* ── Left: details ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3">
              {offer.destination && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} strokeWidth={1.8} /> {offer.destination}
                </span>
              )}
              {(offer.dateFrom || offer.dateTo) && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays size={14} strokeWidth={1.8} />
                  {offer.dateFrom && new Date(offer.dateFrom).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {offer.dateTo && ` – ${new Date(offer.dateTo).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                </span>
              )}
              {categories.map((cat) => (
                <span key={cat} className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">{cat}</span>
              ))}
            </div>

            {/* Flight / hotel specifics */}
            {hasDetails && (
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-muted/30">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trip Details</h2>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {offer.airline && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Plane size={16} className="text-blue-500" />
                      </div>
                      <div><p className="text-xs text-muted-foreground">Airline</p><p className="text-sm font-medium">{offer.airline}</p></div>
                    </div>
                  )}
                  {offer.journeyType && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <ArrowRight size={16} className="text-indigo-500" />
                      </div>
                      <div><p className="text-xs text-muted-foreground">Journey</p><p className="text-sm font-medium">{offer.journeyType}</p></div>
                    </div>
                  )}
                  {offer.cabinClass && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                        <Tag size={16} className="text-purple-500" />
                      </div>
                      <div><p className="text-xs text-muted-foreground">Cabin</p><p className="text-sm font-medium">{offer.cabinClass}</p></div>
                    </div>
                  )}
                  {offer.hotelName && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                        <Hotel size={16} className="text-amber-500" />
                      </div>
                      <div><p className="text-xs text-muted-foreground">Hotel</p><p className="text-sm font-medium">{offer.hotelName}</p></div>
                    </div>
                  )}
                  {offer.rating && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                        <Star size={16} className="text-yellow-500" />
                      </div>
                      <div><p className="text-xs text-muted-foreground">Rating</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(offer.rating)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Shield size={16} className="text-emerald-500" />
                    </div>
                    <div><p className="text-xs text-muted-foreground">Fare Type</p><p className="text-sm font-medium">{offer.fareType || "Per Person"}</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {offer.description && (
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-muted/30">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About This Offer</h2>
                </div>
                <div
                  className="p-6 prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: offer.description }}
                />
              </div>
            )}

            {/* Why book with us */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-muted/30 to-muted/10 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Why Book With Us</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: "Secure Booking", desc: "256-bit SSL encryption on all transactions" },
                  { icon: Globe, title: "Expert Support", desc: "Our travel specialists are available 7 days a week" },
                  { icon: CheckCircle, title: "Best Price", desc: "Price matched against all major booking platforms" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={14} className="text-muted-foreground" />
                    </div>
                    <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: sticky pricing card ── */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
            >
              {/* Price header */}
              <div className="bg-gradient-to-br from-foreground to-foreground/80 text-background p-6">
                <p className="text-xs uppercase tracking-widest text-background/60 mb-1">Starting From</p>
                <p className="text-4xl font-bold">{offer.currency} {offer.amount?.toLocaleString()}</p>
                <p className="text-xs text-background/60 mt-1">/ {offer.fareType || "Per Person"}</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Key info */}
                <div className="space-y-2.5 text-sm">
                  {offer.destination && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={13} strokeWidth={1.8} />
                      <span>{offer.destination}</span>
                    </div>
                  )}
                  {offer.dateFrom && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays size={13} strokeWidth={1.8} />
                      <span>
                        {new Date(offer.dateFrom).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        {offer.dateTo && ` – ${new Date(offer.dateTo).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border" />

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="w-full py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Book Now <ArrowRight size={14} />
                </motion.button>

                <p className="text-center text-xs text-muted-foreground">
                  No hidden fees · Instant confirmation
                </p>
              </div>
            </motion.div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[["256-bit", "SSL Secure"], ["ATOL", "Protected"], ["24/7", "Support"]].map(([val, label]) => (
                <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-xs font-bold">{val}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <BookingModal offer={offer} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default OfferDetail;
