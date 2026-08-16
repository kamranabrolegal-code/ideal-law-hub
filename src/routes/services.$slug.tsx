import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { ServiceIcon } from "@/components/site/service-icon";
import { ServiceCard } from "@/components/site/service-card";
import { FIRM_NAME, useServices } from "@/lib/content";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetail,
  head: ({ params }) => {
    const pretty = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const description = `${pretty} legal and consultancy services by ${FIRM_NAME} in Quetta and Islamabad, Pakistan.`;
    return {
      meta: [
        { title: `${pretty} | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY` },
        { name: "description", content: description },
        { property: "og:title", content: `${pretty} Services` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/services/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
    };
  },
});

function ServiceDetail() {
  const { slug } = useParams({ from: "/services/$slug" });
  const { data: services, isLoading } = useServices();
  const service = (services ?? []).find((s) => s.slug === slug);
  const related = (services ?? []).filter((s) => s.category === service?.category && s.slug !== slug);

  if (!service) {
    return (
      <SiteLayout>
        <PageHeader
          title={isLoading ? "Loading service…" : "Service not found"}
          description={
            isLoading ? "" : "This service is not currently listed. Please view all services."
          }
        />
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
      <PageHeader eyebrow="Legal & Consultancy Service" title={service.title} />
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="flex h-14 w-14 items-center justify-center border border-accent/40 bg-secondary">
              <ServiceIcon name={service.icon} className="h-6 w-6 text-primary" />
            </span>
            <p className="mt-8 text-lg leading-relaxed text-foreground">
              {service.long_description}
            </p>
            {service.lawyer && (
              <div className="mt-10 border-l-2 border-accent bg-secondary p-6">
                <p className="eyebrow">Responsible Advocate</p>
                <p className="mt-2 font-display text-2xl">{service.lawyer}</p>
              </div>
            )}
          </div>
          <aside className="card-elegant h-fit p-8">
            <h2 className="text-xl">Discuss your matter</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Book a consultation to receive professional legal guidance on your {service.title.toLowerCase()} matter.
            </p>
            <Link
              to="/consultation"
              className="mt-6 inline-block bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90"
            >
              Book a Consultation
            </Link>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl">Related services</h2>
            <div className="mt-4 h-px w-24 bg-accent" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
            <Link
              to="/services"
              className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:text-accent-foreground"
            >
              All services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
