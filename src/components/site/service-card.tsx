import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "./service-icon";
import type { Service } from "@/lib/content";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card-elegant flex flex-col p-6">
      <span className="flex h-11 w-11 items-center justify-center border border-accent/40 bg-secondary">
        <ServiceIcon name={service.icon} className="h-5 w-5 text-primary" />
      </span>
      <h3 className="mt-5 text-lg text-foreground">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.short_description}
      </p>
      {service.lawyer && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-accent-foreground">
          {service.lawyer}
        </p>
      )}
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:text-accent-foreground"
      >
        Learn More <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}
