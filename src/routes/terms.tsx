import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { FIRM_NAME } from "@/lib/content";

const DESCRIPTION =
  "Terms & Conditions governing use of the IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY website.";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Terms & Conditions | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Terms & Conditions" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});

function Terms() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-20 text-sm leading-relaxed text-muted-foreground lg:px-8">
        <p>
          By accessing and using this website you agree to these terms. The website is operated by{" "}
          {FIRM_NAME}.
        </p>
        <h2 className="text-xl text-foreground">Use of the website</h2>
        <p>
          Content on this website is provided for general information about the firm and its legal
          and consultancy services. You agree not to misuse the website or submit false, unlawful or
          misleading information through its forms.
        </p>
        <h2 className="text-xl text-foreground">No advocate-client relationship</h2>
        <p>
          Submitting a form or contacting the firm through this website does not by itself create an
          advocate-client relationship. Such a relationship arises only upon formal engagement.
        </p>
        <h2 className="text-xl text-foreground">Intellectual property</h2>
        <p>
          The firm name, content and materials on this website belong to the firm and may not be
          reproduced without permission.
        </p>
        <h2 className="text-xl text-foreground">Changes</h2>
        <p>These terms may be updated from time to time; the current version applies to your use.</p>
      </section>
    </SiteLayout>
  );
}
