import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { FIRM_NAME } from "@/lib/content";

const DESCRIPTION =
  "Privacy Policy of IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY explaining how visitor and client information submitted through this website is handled.";

export const Route = createFileRoute("/privacy-policy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
});

function Privacy() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-20 text-sm leading-relaxed text-muted-foreground lg:px-8">
        <p>
          {FIRM_NAME} respects the privacy of every visitor and client. This policy explains how
          information submitted through this website is collected and used.
        </p>
        <h2 className="text-xl text-foreground">Information we collect</h2>
        <p>
          We collect only the information you voluntarily provide through the consultation and case
          inquiry forms, such as your name, contact number, email address, city and a description of
          your matter.
        </p>
        <h2 className="text-xl text-foreground">How information is used</h2>
        <p>
          Submitted information is used solely to respond to your request, arrange consultations and
          assess the legal assistance required. It is not sold or rented to third parties.
        </p>
        <h2 className="text-xl text-foreground">Confidentiality</h2>
        <p>
          Information relating to your matter is treated as confidential and is accessible only to
          authorised personnel of the firm.
        </p>
        <h2 className="text-xl text-foreground">Contact</h2>
        <p>
          For any question regarding this policy, please contact the firm using the details on the
          Contact page.
        </p>
      </section>
    </SiteLayout>
  );
}
