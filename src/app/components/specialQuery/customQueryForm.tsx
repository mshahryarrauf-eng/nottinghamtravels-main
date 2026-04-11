"use client";

// src/app/components/specialQuery/customQueryForm.tsx
// ─── Wired to /api/tailor-made-query → MongoDB → Admin Panel ─────────────────
// Maps form fields to TailormadeQuery model schema:
//   fullName      → firstName + lastName
//   phone         → contact
//   tourType      → lookingFor
//   fromDestination → leavingFrom
//   toDestination   → destination
//   specialRequests → message

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, PlaneTakeoff,
  Banknote, Tag, MessageSquare, ArrowRight, Loader2,
  CheckCircle2
} from "lucide-react";
import QueryInputField from "./queryInputField";
import QuerySelectField from "./querySelectField";
import QueryTextareaField from "./queryTextareaField";
import QueryDateField from "./queryDateField";
import QueryPassengerField from "./queryPassengerField";

interface PassengerCounts { adults: number; children: number; infants: number }

interface FormState {
  fullName: string; email: string; phone: string; tourType: string;
  fromDestination: string; toDestination: string;
  departureDate: Date | undefined; returnDate: Date | undefined;
  passengers: PassengerCounts; budgetRange: string; specialRequests: string;
}

interface FormErrors {
  fullName?: string; email?: string; phone?: string; tourType?: string;
  toDestination?: string; departureDate?: string;
}

const INITIAL: FormState = {
  fullName: "", email: "", phone: "", tourType: "",
  fromDestination: "", toDestination: "",
  departureDate: undefined, returnDate: undefined,
  passengers: { adults: 1, children: 0, infants: 0 },
  budgetRange: "", specialRequests: "",
};

const TOUR_TYPES = [
  { value: "Flight Only", label: "Flight Only" },
  { value: "Hotel Only", label: "Hotel Only" },
  { value: "Package", label: "Holiday Package" },
  { value: "Hajj", label: "Hajj" },
  { value: "Umrah", label: "Umrah" },
  { value: "Other", label: "Other / Not Sure" },
];

const BUDGET_OPTIONS = [
  { value: "Under £500", label: "Under £500" },
  { value: "£500 - £1,000", label: "£500 – £1,000" },
  { value: "£1,000 - £2,500", label: "£1,000 – £2,500" },
  { value: "£2,500 - £5,000", label: "£2,500 – £5,000" },
  { value: "£5,000 - £10,000", label: "£5,000 – £10,000" },
  { value: "Over £10,000", label: "Over £10,000" },
  { value: "Flexible", label: "Flexible / Not Sure" },
];

function validate(form: FormState): FormErrors {
  const e: FormErrors = {};
  if (!form.fullName.trim()) e.fullName = "Full name is required";
  if (!form.email.trim()) e.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
  if (!form.phone.trim()) e.phone = "Phone number is required";
  if (!form.tourType) e.tourType = "Please select a tour type";
  if (!form.toDestination.trim()) e.toDestination = "Destination is required";
  if (!form.departureDate) e.departureDate = "Please select a departure date";
  return e;
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-12 space-y-5"
    >
      <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
        <CheckCircle2 size={32} className="text-emerald-500" />
      </div>
      <div>
        <h3 className="text-xl font-semibold">Query Submitted!</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          One of our travel specialists will review your request and get back to you within 24 hours.
        </p>
      </div>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border hover:bg-muted transition text-sm"
      >
        Submit Another Query
      </button>
    </motion.div>
  );
}

function FormSection({ title, index, children }: { title: string; index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground text-background text-xs font-semibold shrink-0">
          {index + 1}
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </motion.div>
  );
}

export default function CustomQueryForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError(null);

    // Map form → TailormadeQuery schema
    const nameParts = form.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "-";

    // lookingFor must be one of: 'Flight Only' | 'Hotel Only' | 'Package'
    const lookingForMap: Record<string, string> = {
      "Flight Only": "Flight Only",
      "Hotel Only": "Hotel Only",
      "Package": "Package",
      "Hajj": "Package",
      "Umrah": "Package",
      "Other": "Package",
    };

    const payload = {
      firstName,
      lastName,
      contact: form.phone,
      email: form.email,
      lookingFor: [lookingForMap[form.tourType] || "Package"],
      departureDate: form.departureDate!.toISOString(),
      returnDate: form.returnDate ? form.returnDate.toISOString() : undefined,
      leavingFrom: form.fromDestination || "Not specified",
      destination: form.toDestination,
      // hotelRating not in new form — omit
      transfers: form.budgetRange || undefined,
      // Use specialRequests as message; append tour type and passenger info
      message: [
        form.specialRequests,
        `Tour type: ${form.tourType}`,
        `Passengers: ${form.passengers.adults} adult(s), ${form.passengers.children} child(ren), ${form.passengers.infants} infant(s)`,
        form.budgetRange ? `Budget: ${form.budgetRange}` : "",
      ].filter(Boolean).join("\n"),
    };

    try {
      const res = await fetch("/api/tailor-made-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: any) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <SuccessScreen onReset={() => { setForm(INITIAL); setErrors({}); setSubmitted(false); }} />;

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key="form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
        noValidate
      >
        {apiError && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3">
            {apiError}
          </div>
        )}

        <FormSection title="Personal Details" index={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <QueryInputField label="Full Name" placeholder="e.g. John Smith" value={form.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("fullName", e.target.value)}
              icon={<User size={15} strokeWidth={1.8} />} error={errors.fullName} />
            <QueryInputField label="Email Address" type="email" placeholder="e.g. john@email.com" value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("email", e.target.value)}
              icon={<Mail size={15} strokeWidth={1.8} />} error={errors.email} />
            <QueryInputField label="Phone Number" type="tel" placeholder="e.g. +44 7700 900000" value={form.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("phone", e.target.value)}
              icon={<Phone size={15} strokeWidth={1.8} />} error={errors.phone} />
            <QuerySelectField label="Tour Type" options={TOUR_TYPES} value={form.tourType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set("tourType", e.target.value)}
              icon={<Tag size={15} strokeWidth={1.8} />} error={errors.tourType} />
          </div>
        </FormSection>

        <FormSection title="Travel Details" index={1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <QueryInputField label="Travelling From" placeholder="e.g. London, UK" value={form.fromDestination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("fromDestination", e.target.value)}
              icon={<PlaneTakeoff size={15} strokeWidth={1.8} />} />
            <QueryInputField label="Destination" placeholder="e.g. Dubai, UAE" value={form.toDestination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("toDestination", e.target.value)}
              icon={<MapPin size={15} strokeWidth={1.8} />} error={errors.toDestination} />
            <QueryDateField label="Departure Date" value={form.departureDate}
              onSelect={(d: Date | undefined) => set("departureDate", d)}
              placeholder="Select departure" error={errors.departureDate} />
            <QueryDateField label="Return Date (Optional)" value={form.returnDate}
              onSelect={(d: Date | undefined) => set("returnDate", d)}
              placeholder="Select return" disableBefore={form.departureDate} />
            <QueryPassengerField value={form.passengers}
              onChange={(v: PassengerCounts) => set("passengers", v)} />
            <QuerySelectField label="Budget Range" options={BUDGET_OPTIONS} value={form.budgetRange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set("budgetRange", e.target.value)}
              icon={<Banknote size={15} strokeWidth={1.8} />} />
          </div>
        </FormSection>

        <FormSection title="Additional Information" index={2}>
          <QueryTextareaField
            label="Special Requests or Message"
            placeholder="Tell us anything specific — visa requirements, dietary needs, preferred airlines, accessibility needs, or any questions..."
            value={form.specialRequests}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set("specialRequests", e.target.value)}
            icon={<MessageSquare size={15} strokeWidth={1.8} />}
          />
        </FormSection>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.04 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              : <>Submit Query <ArrowRight size={16} /></>
            }
          </motion.button>
        </motion.div>
      </motion.form>
    </AnimatePresence>
  );
}
