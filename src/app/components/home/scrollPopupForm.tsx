"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Phone, Mail, User, ArrowRight, CheckCircle2, Loader2,
  MapPin, PlaneTakeoff, CalendarDays, Clock, Users, Banknote, ChevronLeft, ChevronRight
} from "lucide-react"

// ── Reusable input ─────────────────────────────────────────────────────────────
function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        {icon}
      </div>
      {children}
    </div>
  )
}

const inputCls = "w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors bg-white"
const selectCls = `${inputCls} appearance-none cursor-pointer`

// ── Step indicator ─────────────────────────────────────────────────────────────
function Steps({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center mb-4">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current ? "w-6 bg-gray-900"
          : i === current ? "w-8 bg-gray-900"
          : "w-4 bg-gray-200"
        }`} />
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ScrollPopupForm() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    // Step 0 — Contact
    name: "",
    email: "",
    phone: "",
    // Step 1 — Trip details
    interest: "Holiday Package",
    leavingFrom: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    preferredTime: "",
    // Step 2 — Passengers & budget
    adults: 1,
    children: 0,
    infants: 0,
    budget: "",
    message: "",
  })

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }))

  // Scroll trigger
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("popupSeen")
    if (alreadySeen) return

    const handleScroll = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (pct >= 50) {
        setVisible(true)
        window.removeEventListener("scroll", handleScroll)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem("popupSeen", "true")
  }

  // Step validation
  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) { setError("Please enter your name."); return false }
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setError("Please enter a valid email."); return false }
      if (!form.phone.trim()) { setError("Please enter your phone number."); return false }
    }
    if (step === 1) {
      if (!form.destination.trim()) { setError("Please enter a destination."); return false }
      if (!form.departureDate) { setError("Please select a departure date."); return false }
    }
    setError(null)
    return true
  }

  const nextStep = () => { if (validateStep()) setStep((s) => s + 1) }
  const prevStep = () => { setError(null); setStep((s) => s - 1) }

  const totalPassengers = form.adults + form.children + form.infants

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return
    setLoading(true)

    const lookingForMap: Record<string, string> = {
      "Flight Only": "Flight Only",
      "Hotel Only": "Hotel Only",
      "Holiday Package": "Package",
      "Hajj / Umrah": "Package",
      "Religious Tour": "Package",
      "General Enquiry": "Package",
    }

    const message = [
      form.message,
      `Interest: ${form.interest}`,
      form.leavingFrom ? `Leaving from: ${form.leavingFrom}` : "",
      form.preferredTime ? `Preferred departure time: ${form.preferredTime}` : "",
      `Passengers: ${form.adults} adult(s), ${form.children} child(ren), ${form.infants} infant(s)`,
      form.budget ? `Budget: ${form.budget}` : "",
    ].filter(Boolean).join("\n")

    try {
      const res = await fetch("/api/tailor-made-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.name.split(" ")[0],
          lastName: form.name.split(" ").slice(1).join(" ") || "-",
          contact: form.phone,
          email: form.email,
          lookingFor: [lookingForMap[form.interest] || "Package"],
          departureDate: form.departureDate
            ? new Date(form.departureDate).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: form.returnDate ? new Date(form.returnDate).toISOString() : undefined,
          leavingFrom: form.leavingFrom || "Not specified",
          destination: form.destination || "Not specified",
          message,
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      sessionStorage.setItem("popupSeen", "true")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const stepTitles = [
    { title: "Your Details", sub: "So we can get back to you" },
    { title: "Trip Details", sub: "Where & when do you want to go?" },
    { title: "Passengers & Budget", sub: "Help us tailor your quote" },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed z-[9999] inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="relative bg-gray-900 px-6 pt-5 pb-6">
                <button onClick={handleDismiss}
                  className="absolute top-4 right-4 h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                  <X size={14} />
                </button>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Free Quote</p>
                <h2 className="text-xl font-semibold text-white">
                  {stepTitles[step]?.title ?? "Almost done"}
                </h2>
                <p className="text-white/50 text-sm mt-0.5">
                  {stepTitles[step]?.sub ?? ""}
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-6 space-y-3"
                  >
                    <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 size={28} className="text-emerald-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">We'll be in touch!</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      One of our travel specialists will contact you within 24 hours with a personalised quote.
                    </p>
                    <button onClick={handleDismiss} className="mt-2 text-sm text-gray-400 hover:text-gray-700 transition underline">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <Steps current={step} total={3} />

                    {error && (
                      <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
                    )}

                    {/* ── Step 0: Contact ── */}
                    <AnimatePresence mode="wait">
                      {step === 0 && (
                        <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                          className="space-y-3">
                          <Field icon={<User size={15} />}>
                            <input type="text" placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
                          </Field>
                          <Field icon={<Mail size={15} />}>
                            <input type="email" placeholder="Email address" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                          </Field>
                          <Field icon={<Phone size={15} />}>
                            <input type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
                          </Field>
                          <Field icon={<PlaneTakeoff size={15} />}>
                            <select value={form.interest} onChange={(e) => set("interest", e.target.value)} className={selectCls}>
                              <option>General Enquiry</option>
                              <option>Flight Only</option>
                              <option>Hotel Only</option>
                              <option>Holiday Package</option>
                              <option>Hajj / Umrah</option>
                              <option>Religious Tour</option>
                            </select>
                          </Field>
                        </motion.div>
                      )}

                      {/* ── Step 1: Trip details ── */}
                      {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                          className="space-y-3">
                          <Field icon={<PlaneTakeoff size={15} />}>
                            <input type="text" placeholder="Leaving from (e.g. London)" value={form.leavingFrom} onChange={(e) => set("leavingFrom", e.target.value)} className={inputCls} />
                          </Field>
                          <Field icon={<MapPin size={15} />}>
                            <input type="text" placeholder="Destination (e.g. Dubai)" value={form.destination} onChange={(e) => set("destination", e.target.value)} className={inputCls} />
                          </Field>
                          <div className="grid grid-cols-2 gap-3">
                            <Field icon={<CalendarDays size={15} />}>
                              <input type="date" placeholder="Departure" value={form.departureDate} onChange={(e) => set("departureDate", e.target.value)}
                                className={inputCls}
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </Field>
                            <Field icon={<CalendarDays size={15} />}>
                              <input type="date" placeholder="Return" value={form.returnDate} onChange={(e) => set("returnDate", e.target.value)}
                                className={inputCls}
                                min={form.departureDate || new Date().toISOString().split("T")[0]}
                              />
                            </Field>
                          </div>
                          <Field icon={<Clock size={15} />}>
                            <select value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} className={selectCls}>
                              <option value="">Preferred departure time (optional)</option>
                              <option>Early morning (04:00 – 08:00)</option>
                              <option>Morning (08:00 – 12:00)</option>
                              <option>Afternoon (12:00 – 17:00)</option>
                              <option>Evening (17:00 – 21:00)</option>
                              <option>Night (21:00 – 04:00)</option>
                              <option>No preference</option>
                            </select>
                          </Field>
                        </motion.div>
                      )}

                      {/* ── Step 2: Passengers & budget ── */}
                      {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                          className="space-y-3">

                          {/* Passenger counters */}
                          <div className="rounded-xl border border-gray-200 divide-y divide-gray-100">
                            {([
                              { label: "Adults", sub: "12+ yrs", key: "adults", min: 1 },
                              { label: "Children", sub: "2–11 yrs", key: "children", min: 0 },
                              { label: "Infants", sub: "Under 2", key: "infants", min: 0 },
                            ] as const).map(({ label, sub, key, min }) => (
                              <div key={key} className="flex items-center justify-between px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{label}</p>
                                  <p className="text-xs text-gray-400">{sub}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button type="button"
                                    onClick={() => set(key, Math.max(min, form[key] - 1))}
                                    disabled={form[key] <= min}
                                    className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center text-gray-600 disabled:opacity-30">
                                    −
                                  </button>
                                  <span className="w-5 text-center text-sm font-bold text-gray-900">{form[key]}</span>
                                  <button type="button"
                                    onClick={() => set(key, form[key] + 1)}
                                    className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center text-gray-600">
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Budget */}
                          <Field icon={<Banknote size={15} />}>
                            <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className={selectCls}>
                              <option value="">Budget range (optional)</option>
                              <option>Under £500</option>
                              <option>£500 – £1,000</option>
                              <option>£1,000 – £2,500</option>
                              <option>£2,500 – £5,000</option>
                              <option>£5,000 – £10,000</option>
                              <option>Over £10,000</option>
                              <option>Flexible</option>
                            </select>
                          </Field>

                          {/* Message */}
                          <textarea
                            placeholder="Any special requests or questions? (optional)"
                            value={form.message}
                            onChange={(e) => set("message", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors resize-none"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className={`flex mt-5 gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}>
                      {step > 0 && (
                        <button type="button" onClick={prevStep}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                          <ChevronLeft size={14} /> Back
                        </button>
                      )}
                      {step < 2 ? (
                        <button type="button" onClick={nextStep}
                          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition">
                          Continue <ChevronRight size={14} />
                        </button>
                      ) : (
                        <motion.button type="submit" disabled={loading}
                          whileHover={{ scale: loading ? 1 : 1.02 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                          {loading
                            ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                            : <>Get My Quote <ArrowRight size={14} /></>
                          }
                        </motion.button>
                      )}
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-3">
                      No spam · We only contact you about your enquiry
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}