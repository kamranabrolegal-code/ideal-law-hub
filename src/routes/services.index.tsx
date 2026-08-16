import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { ServiceCard } from "@/components/site/service-card";
import { CATEGORY_LABELS, useServices } from "@/lib/content";

const DESCRIPTION =
  "Civil, criminal, banking, family, cyber, tribunal, corporate, taxation, immigration, intellectual property, NGO/NPO and WEBOC legal and consultancy services.";

export const Route = createFileRoute("/services/")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Our Legal & Consultancy Services | IDEAL INTERNATIONAL LAW FIRM" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Our Legal & Consultancy Services" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

const ORDER = ["legal", "corporate", "taxation", "immigration", "ip", "other"];

function Services() {
  const { data: services } = useServices();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our Services"
        title="Our Legal & Consultancy Services"
        description={DESCRIPTION}
      />
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-20 lg:px-8">
        {ORDER.map((cat) => {
          const items = (services ?? []).filter((s) => s.category === cat);
          if (!items.length) return null;
          return (
            <section key={cat}>
              <h2 className="text-2xl sm:text-3xl">{CATEGORY_LABELS[cat] ?? cat}</h2>
              <div className="mt-4 h-px w-24 bg-accent" />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </SiteLayout>
  );
}
