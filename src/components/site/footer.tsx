import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { FIRM_NAME, useOffices, useSiteContent, text } from "@/lib/content";

const QUICK: { label: string; to: string; params?: Record<string, string> }[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Civil Law", to: "/services/$slug", params: { slug: "civil" } },
  { label: "Criminal Law", to: "/services/$slug", params: { slug: "criminal" } },
  { label: "Corporate Law", to: "/practice/$area", params: { area: "corporate" } },
  { label: "Taxation", to: "/practice/$area", params: { area: "taxation" } },
  { label: "Immigration", to: "/practice/$area", params: { area: "immigration" } },
  { label: "Contact", to: "/contact" },
];

export function SiteFooter() {
  const { data: content } = useSiteContent();
  const { data: offices } = useOffices();

  return (
    <footer className="surface-navy">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <h2 className="font-display text-lg leading-snug text-navy-foreground">{FIRM_NAME}</h2>
          <div className="mt-4 space-y-1 text-sm text-navy-foreground/75">
            <p>
              <span className="text-gold">{text(content, "ceo_name")}</span> —{" "}
              {text(content, "ceo_title")}
            </p>
            <p className="text-gold">{text(content, "advocate_name")}</p>
          </div>
          {content?.["firm_registration"] && (
            <p className="mt-4 text-xs text-navy-foreground/55">{content["firm_registration"]}</p>
          )}
        </div>

        <div>
          <h3 className="eyebrow">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {QUICK.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  params={l.params as never}
                  className="text-navy-foreground/75 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="eyebrow">Offices</h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {(offices ?? []).map((o) => (
              <div key={o.id} className="text-sm text-navy-foreground/75">
                <p className="font-display text-base text-navy-foreground">{o.name}</p>
                <p className="mt-2 flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                  <span>{o.address}</span>
                </p>
                {o.phones && (
                  <p className="mt-1.5 flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                    <span>{o.phones}</span>
                  </p>
                )}
                {o.email && (
                  <p className="mt-1.5 flex gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                    <a href={`mailto:${o.email}`} className="hover:text-gold">
                      {o.email}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <p className="text-xs leading-relaxed text-navy-foreground/60">
            <strong className="text-navy-foreground/80">Disclaimer:</strong>{" "}
            {text(content, "disclaimer")}
          </p>
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {FIRM_NAME}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link to="/privacy-policy" className="hover:text-gold">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gold">
                Terms & Conditions
              </Link>
              <Link to="/disclaimer" className="hover:text-gold">
                Disclaimer
              </Link>
              <Link to="/admin" className="hover:text-gold">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
