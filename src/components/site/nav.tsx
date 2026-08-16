import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";
import { FIRM_NAME } from "@/lib/content";

const LINKS: { label: string; to: string; params?: Record<string, string> }[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Services", to: "/services" },
  { label: "Civil Law", to: "/services/$slug", params: { slug: "civil" } },
  { label: "Criminal Law", to: "/services/$slug", params: { slug: "criminal" } },
  { label: "Corporate & Business Law", to: "/practice/$area", params: { area: "corporate" } },
  { label: "Taxation", to: "/practice/$area", params: { area: "taxation" } },
  { label: "Immigration & Visa", to: "/practice/$area", params: { area: "immigration" } },
  { label: "Intellectual Property", to: "/practice/$area", params: { area: "ip" } },
  { label: "Litigation", to: "/practice/$area", params: { area: "litigation" } },
  { label: "Contact Us", to: "/contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 surface-navy border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center border border-gold/60">
            <Scale className="h-5 w-5 text-gold" strokeWidth={1.4} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[0.95rem] tracking-wide text-navy-foreground sm:text-base">
              IDEAL
            </span>
            <span className="block text-[0.58rem] uppercase tracking-[0.18em] text-gold-soft">
              International Law Firm & Consultancy
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden xl:block">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  params={l.params as never}
                  activeProps={{ className: "text-gold" }}
                  className="text-[0.78rem] uppercase tracking-[0.09em] text-navy-foreground/85 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/consultation"
          className="ml-auto hidden shrink-0 bg-gold px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-foreground transition-opacity hover:opacity-90 xl:ml-4 lg:block"
        >
          Book a Consultation
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto text-navy-foreground xl:hidden"
        >
          {open ? <Menu className="hidden" /> : null}
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-white/10 bg-navy-deep xl:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-3">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  params={l.params as never}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/5 py-2.5 text-sm uppercase tracking-[0.08em] text-navy-foreground/85"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                to="/consultation"
                onClick={() => setOpen(false)}
                className="block bg-gold px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground"
              >
                Book a Consultation
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
