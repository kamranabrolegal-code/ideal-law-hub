import type { ReactNode } from "react";
import { SiteNav } from "./nav";
import { SiteFooter } from "./footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="surface-navy">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight text-navy-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75">
            {description}
          </p>
        )}
        <div className="mt-8 h-px w-24 bg-gold" />
      </div>
    </section>
  );
}
