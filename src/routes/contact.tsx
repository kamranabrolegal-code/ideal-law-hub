import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { CaseInquiryForm } from "@/components/site/inquiry-form";
import { useOffices, useSiteContent } from "@/lib/content";

const DESCRIPTION =
  "Contact IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY — Quetta and Islamabad offices. Phone, email and case inquiry form.";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Us | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Contact IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  const { data: offices } = useOffices();
  const { data: content } = useSiteContent();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact Us"
        title="Speak with our legal team"
        description="Reach the firm at our Quetta or Islamabad office, or submit a case inquiry below."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {(offices ?? []).map((o) => (
            <article key={o.id} className="card-elegant p-8">
              <h2 className="font-display text-2xl">{o.name}</h2>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" strokeWidth={1.5} />
                  {o.address}
                </p>
                {o.phones && (
                  <p className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" strokeWidth={1.5} />
                    {o.phones}
                  </p>
                )}
                {o.email && (
                  <p className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" strokeWidth={1.5} />
                    <a href={`mailto:${o.email}`} className="hover:text-primary">
                      {o.email}
                    </a>
                  </p>
                )}
                {o.website && (
                  <p className="flex gap-3">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" strokeWidth={1.5} />
                    {o.website}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {content?.["firm_registration"] && (
          <p className="mt-10 text-sm text-muted-foreground">{content["firm_registration"]}</p>
        )}

        <div className="mt-20">
          <h2 className="text-2xl">Case / Client Inquiry</h2>
          <div className="mt-4 h-px w-24 bg-accent" />
          <div className="mt-8">
            <CaseInquiryForm />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
