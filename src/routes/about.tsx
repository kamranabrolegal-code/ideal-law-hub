import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { FIRM_NAME, useSiteContent, text } from "@/lib/content";

const DESCRIPTION =
  "About IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY — legal representation, consultancy, litigation and advisory services led by H D AZAD, CEO.";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "About IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  const { data: content } = useSiteContent();

  return (
    <SiteLayout>
      <PageHeader eyebrow="About Us" title={FIRM_NAME} description={text(content, "about_body")} />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="card-elegant p-8">
            <p className="eyebrow">Leadership</p>
            <h2 className="mt-3 font-display text-3xl">{text(content, "ceo_name")}</h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">
              {text(content, "ceo_title")}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {text(content, "ceo_bio")}
            </p>
          </article>

          <article className="card-elegant p-8">
            <p className="eyebrow">Legal Representation</p>
            <h2 className="mt-3 font-display text-3xl">{text(content, "advocate_name")}</h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">
              Civil Law · Criminal Law
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {text(content, "advocate_bio")}
            </p>
          </article>
        </div>

        {content?.["firm_registration"] && (
          <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
            {content["firm_registration"]}
          </p>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/consultation"
            className="bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90"
          >
            Book a Consultation
          </Link>
          <Link
            to="/services"
            className="border border-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:bg-secondary"
          >
            Our Services
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
