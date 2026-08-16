import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useServices } from "@/lib/content";

const schema = z.object({
  client_name: z.string().trim().min(2, "Please enter the client name").max(100),
  contact_number: z.string().trim().min(7, "Please enter a valid contact number").max(30),
  email: z.string().trim().email("Invalid email address").max(255).or(z.literal("")),
  city: z.string().trim().max(80),
  court_tribunal: z.string().trim().max(150),
  case_type: z.string().trim().max(120),
  case_reference: z.string().trim().max(120),
  case_details: z.string().trim().max(3000),
  required_service: z.string().trim().max(120),
});

const field =
  "w-full border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";
const labelCls = "block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

export function CaseInquiryForm() {
  const { data: services } = useServices();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const v = parsed.data;
    const { error } = await supabase.from("case_inquiries").insert({
      client_name: v.client_name,
      contact_number: v.contact_number,
      email: v.email || null,
      city: v.city || null,
      court_tribunal: v.court_tribunal || null,
      case_type: v.case_type || null,
      case_reference: v.case_reference || null,
      case_details: v.case_details || null,
      required_service: v.required_service || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not submit your inquiry. Please try again.");
      return;
    }
    toast.success("Your case inquiry has been received in confidence.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className={labelCls} htmlFor="client_name">
          Client Name
        </label>
        <input id="client_name" name="client_name" required className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="contact_number">
          Contact Number
        </label>
        <input id="contact_number" name="contact_number" required className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="inq_email">
          Email
        </label>
        <input id="inq_email" name="email" type="email" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="inq_city">
          City
        </label>
        <input id="inq_city" name="city" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="court_tribunal">
          Court / Tribunal
        </label>
        <input id="court_tribunal" name="court_tribunal" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="inq_case_type">
          Case Type
        </label>
        <input id="inq_case_type" name="case_type" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="case_reference">
          Case Reference
        </label>
        <input id="case_reference" name="case_reference" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="required_service">
          Required Legal Service
        </label>
        <select id="required_service" name="required_service" className={`mt-2 ${field}`}>
          <option value="">Select a service</option>
          {(services ?? []).map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls} htmlFor="case_details">
          Brief Case Details
        </label>
        <textarea id="case_details" name="case_details" rows={5} className={`mt-2 ${field}`} />
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <ShieldCheck className="h-4 w-4" strokeWidth={1.6} />
          {loading ? "Submitting…" : "Secure Submit"}
        </button>
        <p className="text-xs text-muted-foreground">
          Submissions are transmitted securely and treated as confidential.
        </p>
      </div>
    </form>
  );
}
