import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Scale, Landmark, Lock } from "lucide-react";
import heroImage from "@/assets/hero-courthouse.jpg";
import scalesImage from "@/assets/scales.jpg";
import { SiteLayout } from "@/components/site/layout";
import { ServiceCard } from "@/components/site/service-card";
import { ConsultationForm } from "@/components/site/consultation-form";
import { CaseInquiryForm } from "@/components/site/inquiry-form";
import { FIRM_NAME, useServices, useSiteContent, text } from "@/lib/content";

const DESCRIPTION =
  "IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY provides legal representation, litigation, consultancy and business legal services in Quetta and Islamabad, Pakistan.";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY | Lawyers in Quetta" },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "Ideal International Law Firm and Consultancy, law firm in Quetta, lawyers in Quetta, civil lawyer in Quetta, criminal lawyer in Quetta, Kamran Abro Advocate, legal consultancy in Quetta, corporate legal services, taxation services, immigration and visa services, cyber law, civil litigation, criminal litigation, legal consultancy Pakistan",
      },
      { property: "og:title", content: "IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LegalService",
          name: FIRM_NAME,
          description: DESCRIPTION,
          areaServed: "Pakistan",
          address: [
            {
              "@type": "PostalAddress",
              streetAddress: "Office # T1 KFK Business Center, Manan Chowk",
              addressLocality: "Quetta",
              addressCountry: "PK",
            },
            {
              "@type": "PostalAddress",
              streetAddress: "Chamber # 2, Football Ground Street # 6, Anwar Block, F-8",
              addressLocality: "Islamabad",
              addressCountry: "PK",
            },
          ],
          employee: [
            { "@type": "Person", name: "H D AZAD", jobTitle: "CEO" },
            { "@type": "Person", name: "Kamran Abro", jobTitle: "Advocate" },
          ],
        }),
      },
    ],
  }),
});

function Home() {
  const { data: content } = useSiteContent();
  const { data: services } = useServices();

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Classical courthouse colonnade at dusk"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-navy-deep/85" />
        <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
          <p className="eyebrow">Established Legal Practice · Quetta · Islamabad</p>
          <h1 className="mt-5 max-w-4xl text-3xl leading-[1.15] text-navy-foreground sm:text-5xl lg:text-6xl">
            {text(content, "hero_title")}
          </h1>
          <p className="mt-6 font-display text-xl text-gold sm:text-2xl">
            {text(content, "hero_subtitle")}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-foreground/80">
            {text(content, "hero_description")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/consultation"
              className="bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground transition-opacity hover:opacity-90"
            >
              Book a Consultation
            </Link>
            <Link
              to="/services"
              className="border border-navy-foreground/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-navy-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Our Services
            </Link>
          </div>
          <ul className="mt-14 grid max-w-3xl gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            {[
              { icon: Scale, label: "Trust & Professionalism" },
              { icon: Lock, label: "Client Confidentiality" },
              { icon: Landmark, label: "International Standards" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-navy-foreground/80">
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">About the Firm</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{FIRM_NAME}</h2>
            <div className="mt-5 h-px w-24 bg-accent" />
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {text(content, "about_body")}
            </p>
            <div className="mt-8 border-l-2 border-accent bg-secondary p-6">
              <p className="font-display text-2xl text-foreground">{text(content, "ceo_name")}</p>
              <p className="eyebrow mt-1">{text(content, "ceo_title")}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {text(content, "ceo_bio")}
              </p>
            </div>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:text-accent-foreground"
            >
              More about the firm <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <img
            src={scalesImage}
            alt="Brass scales of justice beside law books"
            width={1200}
            height={912}
            loading="lazy"
            className="w-full object-cover shadow-[var(--shadow-elegant)]"
          />
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="eyebrow">Our Legal & Consultancy Services</p>
          <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            Comprehensive representation across law, business and compliance
          </h2>
          <div className="mt-5 h-px w-24 bg-accent" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(services ?? []).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTATION CTA */}
      <section className="surface-navy">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-3xl text-navy-foreground sm:text-4xl">Need Legal Assistance?</h2>
            <p className="mt-4 max-w-xl text-navy-foreground/75">
              Speak with our legal team regarding your matter and receive professional legal
              guidance.
            </p>
          </div>
          <Link
            to="/consultation"
            className="bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground transition-opacity hover:opacity-90"
          >
            Book a Consultation
          </Link>
        </div>
      </section>

      {/* FORMS */}
      <section id="consultation" className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Legal Consultation</p>
            <h2 className="mt-3 text-3xl">Request a consultation</h2>
            <div className="mt-5 h-px w-24 bg-accent" />
            <p className="mt-5 text-sm text-muted-foreground">
              Share a brief outline of your matter and a preferred time. Our team will respond to
              arrange your consultation.
            </p>
            <div className="mt-8">
              <ConsultationForm />
            </div>
          </div>
          <div id="inquiry">
            <p className="eyebrow">Case / Client Inquiry</p>
            <h2 className="mt-3 text-3xl">Submit a case inquiry</h2>
            <div className="mt-5 h-px w-24 bg-accent" />
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent-foreground" strokeWidth={1.6} />
              Your case information is handled confidentially.
            </p>
            <div className="mt-8">
              <CaseInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
