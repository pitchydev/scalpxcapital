"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/site";

const TYPES = ["Exchange", "Project", "Creator", "Agency", "Other"];

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch(siteConfig.formsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mm-section scroll-mt-24 bg-flow-black">
      <div className="mx-auto max-w-xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="mm-eyebrow mb-4">Jump in</p>
          <h2 className="mm-section-title">Ready to stop guessing?</h2>
          <p className="mx-auto mt-4 max-w-md text-flow-muted">
            Tell us about your exchange, project or creator goals.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          {status === "success" ? (
            <div className="mm-card p-10 text-center">
              <p className="font-display text-2xl font-semibold text-flow-green">Message sent</p>
              <p className="mt-3 text-flow-muted">We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mm-card space-y-4 p-6 lg:p-8">
              <input type="hidden" name="_subject" value="ScalpX Enquiry" />
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <Field label="Company / Project" name="company" />
              <div>
                <label htmlFor="client_type" className="mm-field-label">I am a...</label>
                <select id="client_type" name="client_type" required className="mm-field">
                  <option value="">Select...</option>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mm-field-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  required
                  placeholder="What are you trying to grow?"
                  className="mm-field resize-none"
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-flow-red">Something went wrong. Email {siteConfig.contactEmail}</p>
              )}
              <button type="submit" disabled={status === "loading"} className="btn-mm w-full !rounded-2xl">
                {status === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mm-field-label">{label}</label>
      <input id={name} name={name} type={type} required={required} className="mm-field" />
    </div>
  );
}
