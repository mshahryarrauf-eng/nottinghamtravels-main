"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import LeazyLoading from "@/components/common/lazyLoading";
import { showAlert } from "@/components/common/mixin";

/* ───────── Section Component ───────── */
function FormSection({ title, children, index }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold">
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </div>
  );
}

/* ───────── Page ───────── */
export default function TravelQueryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/tailor-made-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        showAlert("success", "Your query has been submitted!");
        reset();
      } else {
        showAlert("error", result.error || "Something went wrong");
      }
    } catch {
      showAlert("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background">
      {/* ───────── Loading ───────── */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <LeazyLoading />
        </div>
      )}

      {/* ───────── HERO ───────── */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: 1.08 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src="/bg.jpg"
            alt="Tailor made travel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        </motion.div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            Bespoke Travel
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            Design Your Perfect Journey
          </h1>

          <p className="text-white/80 text-lg">
            Tell us your travel idea — we’ll turn it into a personalised itinerary.
          </p>
        </div>
      </section>

      {/* ───────── FORM SECTION ───────── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Heading */}
          <div className="text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              Start Planning
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold">
              Tell Us About Your Trip
            </h2>

            <p className="text-muted-foreground max-w-xl mx-auto">
              Share your details below and our travel experts will design your perfect trip.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-border bg-card shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              {/* PERSONAL */}
              <FormSection title="Personal Details" index={0}>
                <div className="grid md:grid-cols-2 gap-5">
                  <input className="input" placeholder="First Name"
                    {...register("firstName", { required: true })}
                  />

                  <input className="input" placeholder="Last Name"
                    {...register("lastName", { required: true })}
                  />

                  <input className="input" placeholder="Contact"
                    {...register("contact", { required: true })}
                  />

                  <input className="input" placeholder="Email"
                    {...register("email", { required: true })}
                  />
                </div>
              </FormSection>

              {/* TRAVEL */}
              <FormSection title="Travel Details" index={1}>
                <div className="grid md:grid-cols-2 gap-5">

                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    {["Flight", "Hotel", "Package"].map(opt => (
                      <label key={opt}>
                        <input
                          type="checkbox"
                          value={opt}
                          className="hidden peer"
                          {...register("lookingFor")}
                        />
                        <div className="px-4 py-2 rounded-full border text-sm peer-checked:bg-green-500 peer-checked:text-white">
                          {opt}
                        </div>
                      </label>
                    ))}
                  </div>

                  <input type="date" className="input" {...register("departureDate")} />
                  <input type="date" className="input" {...register("returnDate")} />
                  <input className="input" placeholder="Leaving From" {...register("leavingFrom")} />
                  <input className="input" placeholder="Destination" {...register("destination")} />
                </div>
              </FormSection>

              {/* MESSAGE */}
              <FormSection title="Additional Information" index={2}>
                <textarea
                  rows={4}
                  className="w-full rounded-2xl border border-border p-4"
                  placeholder="Tell us anything special..."
                  {...register("message")}
                />
              </FormSection>

              {/* SUBMIT */}
              <div className="flex justify-end">
                <button className="px-10 py-4 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-[1.02] transition">
                  Send Request
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* ───────── INPUT STYLE ───────── */}
      <style jsx>{`
        .input {
          width: 100%;
          height: 48px;
          border-radius: 16px;
          border: 1px solid var(--border);
          padding: 0 14px;
          font-size: 14px;
          background: var(--background);
        }
      `}</style>
    </main>
  );
}