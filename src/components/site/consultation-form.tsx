import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useServices } from "@/lib/content";

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Invalid email address").max(255).or(z.literal("")),
  city: z.string().trim().max(80),
  service_required: z.string().trim().max(120),
  case_type: z.string().trim().max(120),
  description: z.string().trim().max(2000),
  preferred_date: z.string().max(20),
  preferred_time: z.string().max(20),
});

const field =
  "w-full border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";
const labelCls = "block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

export function ConsultationForm() {
  const { data: services } = useServices();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const v = parsed.data;
    const { error } = await supabase.from("consultation_requests").insert({
      full_name: v.full_name,
      phone: v.phone,
      email: v.email || null,
      city: v.city || null,
      service_required: v.service_required || null,
      case_type: v.case_type || null,
      description: v.description || null,
      preferred_date: v.preferred_date || null,
      preferred_time: v.preferred_time || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not submit your request. Please try again.");
      return;
    }
    toast.success("Your consultation request has been received.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className={labelCls} htmlFor="full_name">
          Full Name
        </label>
        <input id="full_name" name="full_name" required className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="phone">
          Phone Number
        </label>
        <input id="phone" name="phone" required className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" defaultValue="" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="city">
          City
        </label>
        <input id="city" name="city" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="service_required">
          Service Required
        </label>
        <select id="service_required" name="service_required" className={`mt-2 ${field}`}>
          <option value="">Select a service</option>
          {(services ?? []).map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="case_type">
          Case Type
        </label>
        <input id="case_type" name="case_type" className={`mt-2 ${field}`} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls} htmlFor="description">
          Brief Description of Matter
        </label>
        <textarea id="description" name="description" rows={5} className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="preferred_date">
          Preferred Consultation Date
        </label>
        <input id="preferred_date" name="preferred_date" type="date" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="preferred_time">
          Preferred Consultation Time
        </label>
        <input id="preferred_time" name="preferred_time" type="time" className={`mt-2 ${field}`} />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Request"}
        </button>
      </div>
    </form>
  );
}
