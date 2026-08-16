import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { ConsultationForm } from "@/components/site/consultation-form";
import { CaseInquiryForm } from "@/components/site/inquiry-form";

const DESCRIPTION =
  "Book a legal consultation with IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY. Speak with our legal team and receive professional legal guidance.";

export const Route = createFileRoute("/consultation")({
  component: Consultation,
  head: () => ({
    meta: [
      { title: "Book a Consultation | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Book a Legal Consultation" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/consultation" },
    ],
    links: [{ rel: "canonical", href: "/consultation" }],
  }),
});

function Consultation() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Legal Consultation"
        title="Need Legal Assistance?"
        description="Speak with our legal team regarding your matter and receive professional legal guidance."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl">Consultation Request</h2>
            <div className="mt-4 h-px w-24 bg-accent" />
            <div className="mt-8">
              <ConsultationForm />
            </div>
          </div>
          <div>
            <h2 className="text-2xl">Case / Client Inquiry</h2>
            <div className="mt-4 h-px w-24 bg-accent" />
            <div className="mt-8">
              <CaseInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
