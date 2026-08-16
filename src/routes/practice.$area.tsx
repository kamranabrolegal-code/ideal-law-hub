import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { ServiceCard } from "@/components/site/service-card";
import { FIRM_NAME, PRACTICE_AREAS, useServices } from "@/lib/content";

export const Route = createFileRoute("/practice/$area")({
  component: PracticeArea,
  head: ({ params }) => {
    const area = PRACTICE_AREAS[params.area];
    const title = area?.title ?? "Practice Area";
    const description = area?.intro ?? `${title} services by ${FIRM_NAME}.`;
    return {
      meta: [
        { title: `${title} | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} Services` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/practice/${params.area}` },
      ],
      links: [{ rel: "canonical", href: `/practice/${params.area}` }],
    };
  },
});

function PracticeArea() {
  const { area } = useParams({ from: "/practice/$area" });
  const config = PRACTICE_AREAS[area];
  const { data: services } = useServices();
  const items = (services ?? []).filter((s) => config?.slugs.includes(s.slug));

  if (!config) {
    return (
      <SiteLayout>
        <PageHeader title="Practice area not found" />
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <Link to="/services" className="text-sm font-semibold uppercase tracking-[0.14em]">
            View all services
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow="Practice Area" title={config.title} description={config.intro} />
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        <div className="mt-16 surface-navy p-10">
          <h2 className="text-2xl text-navy-foreground sm:text-3xl">Need Legal Assistance?</h2>
          <p className="mt-3 max-w-xl text-navy-foreground/75">
            Speak with our legal team regarding your matter and receive professional legal guidance.
          </p>
          <Link
            to="/consultation"
            className="mt-8 inline-block bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground hover:opacity-90"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
