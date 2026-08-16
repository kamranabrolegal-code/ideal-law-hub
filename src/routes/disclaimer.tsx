import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { useSiteContent, text } from "@/lib/content";

const DESCRIPTION =
  "Legal disclaimer for the IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY website.";

export const Route = createFileRoute("/disclaimer")({
  component: Disclaimer,
  head: () => ({
    meta: [
      { title: "Disclaimer | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Disclaimer" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
});

function Disclaimer() {
  const { data: content } = useSiteContent();
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Disclaimer" />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-20 text-sm leading-relaxed text-muted-foreground lg:px-8">
        <p>{text(content, "disclaimer")}</p>
        <p>
          Every legal matter depends on its own facts. Visitors should not act, or refrain from
          acting, on the basis of information on this website without seeking formal legal advice
          from the firm regarding their specific circumstances.
        </p>
        <p>
          Communication through this website is not confidential until an advocate-client
          relationship has been formally established.
        </p>
      </section>
    </SiteLayout>
  );
}
