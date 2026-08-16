import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ICON_NAMES } from "@/components/site/service-icon";
import { CATEGORY_LABELS, type Office, type Service } from "@/lib/content";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Panel | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: "Administration panel for firm content and inquiries." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel" },
      { property: "og:description", content: "Administration panel for firm content." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/admin" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
});

const field =
  "w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-accent";
const btn =
  "bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 disabled:opacity-60";
const TABS = ["Services", "Content", "Offices", "Consultations", "Inquiries"] as const;
type Tab = (typeof TABS)[number];

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("Services");
  const qc = useQueryClient();

  useEffect(() => {
    let active = true;
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUserId(data.user.id);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
      setReady(true);
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function claim() {
    const { data, error } = await supabase.rpc("claim_admin");
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("You are now the administrator.");
      setIsAdmin(true);
    } else {
      toast.error("An administrator already exists. Ask them to grant you access.");
    }
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!ready) {
    return <div className="p-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl">Administrator access required</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your account ({userId?.slice(0, 8)}…) does not have administrator rights yet. If you are
          setting up the website for the first time, claim the administrator account below.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={claim} className={btn}>
            Claim administrator access
          </button>
          <button onClick={signOut} className="border border-input px-5 py-2.5 text-xs uppercase tracking-[0.14em]">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="surface-navy">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-5 lg:px-8">
          <h1 className="text-xl text-navy-foreground">Admin Panel</h1>
          <Link to="/" className="text-xs uppercase tracking-[0.14em] text-navy-foreground/70 hover:text-gold">
            View website
          </Link>
          <button
            onClick={signOut}
            className="ml-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-navy-foreground/70 hover:text-gold"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 lg:px-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-xs uppercase tracking-[0.12em] ${
                tab === t
                  ? "border-b-2 border-gold text-gold"
                  : "border-b-2 border-transparent text-navy-foreground/70"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {tab === "Services" && <ServicesAdmin />}
        {tab === "Content" && <ContentAdmin />}
        {tab === "Offices" && <OfficesAdmin />}
        {tab === "Consultations" && <SubmissionsAdmin table="consultation_requests" />}
        {tab === "Inquiries" && <SubmissionsAdmin table="case_inquiries" />}
      </main>
    </div>
  );
}

/* ---------------- Services ---------------- */

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  async function save(s: Service) {
    const { error } = await supabase
      .from("services")
      .update({
        title: s.title,
        slug: s.slug,
        category: s.category,
        short_description: s.short_description,
        long_description: s.long_description,
        icon: s.icon,
        lawyer: s.lawyer,
        sort_order: s.sort_order,
        published: s.published,
      })
      .eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Service saved");
    qc.invalidateQueries({ queryKey: ["admin_services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Service removed");
    qc.invalidateQueries({ queryKey: ["admin_services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  }

  async function add() {
    const slug = `new-service-${Date.now().toString().slice(-5)}`;
    const { error } = await supabase.from("services").insert({
      slug,
      title: "New Service",
      category: "other",
      sort_order: (data?.length ?? 0) + 1,
    });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  }

  return (
    <div>
      <button onClick={add} className={`${btn} inline-flex items-center gap-2`}>
        <Plus className="h-4 w-4" /> Add service
      </button>
      <div className="mt-6 space-y-4">
        {(data ?? []).map((s) => (
          <ServiceRow key={s.id} service={s} onSave={save} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}

function ServiceRow({
  service,
  onSave,
  onDelete,
}: {
  service: Service;
  onSave: (s: Service) => void;
  onDelete: (id: string) => void;
}) {
  const [s, setS] = useState(service);
  useEffect(() => setS(service), [service]);

  return (
    <div className="border border-border bg-card p-5">
      <div className="grid gap-4 md:grid-cols-4">
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Title
          <input className={`mt-1 ${field}`} value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} />
        </label>
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          URL slug
          <input className={`mt-1 ${field}`} value={s.slug} onChange={(e) => setS({ ...s, slug: e.target.value })} />
        </label>
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Category
          <select
            className={`mt-1 ${field}`}
            value={s.category}
            onChange={(e) => setS({ ...s, category: e.target.value })}
          >
            {Object.keys(CATEGORY_LABELS).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Icon
          <select className={`mt-1 ${field}`} value={s.icon} onChange={(e) => setS({ ...s, icon: e.target.value })}>
            {ICON_NAMES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground md:col-span-2">
          Short description
          <input
            className={`mt-1 ${field}`}
            value={s.short_description}
            onChange={(e) => setS({ ...s, short_description: e.target.value })}
          />
        </label>
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Responsible lawyer
          <input
            className={`mt-1 ${field}`}
            value={s.lawyer ?? ""}
            onChange={(e) => setS({ ...s, lawyer: e.target.value || null })}
          />
        </label>
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Sort order
          <input
            type="number"
            className={`mt-1 ${field}`}
            value={s.sort_order}
            onChange={(e) => setS({ ...s, sort_order: Number(e.target.value) })}
          />
        </label>
        <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground md:col-span-4">
          Full description
          <textarea
            rows={3}
            className={`mt-1 ${field}`}
            value={s.long_description}
            onChange={(e) => setS({ ...s, long_description: e.target.value })}
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button onClick={() => onSave(s)} className={btn}>
          Save
        </button>
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground">
          <input
            type="checkbox"
            checked={s.published}
            onChange={(e) => setS({ ...s, published: e.target.checked })}
          />
          Published
        </label>
        <button
          onClick={() => onDelete(s.id)}
          className="ml-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-destructive"
        >
          <Trash2 className="h-4 w-4" /> Remove
        </button>
      </div>
    </div>
  );
}

/* ---------------- Content ---------------- */

function ContentAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("key");
      if (error) throw error;
      return data as { key: string; value: string; label: string }[];
    },
  });
  const [draft, setDraft] = useState<Record<string, string>>({});

  async function save(key: string) {
    const value = draft[key] ?? "";
    const { error } = await supabase.from("site_content").update({ value }).eq("key", key);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin_content"] });
    qc.invalidateQueries({ queryKey: ["site_content"] });
  }

  return (
    <div className="space-y-4">
      {(data ?? []).map((row) => (
        <div key={row.key} className="border border-border bg-card p-5">
          <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
            {row.label || row.key}
            <textarea
              rows={row.value.length > 120 ? 4 : 2}
              className={`mt-2 ${field}`}
              value={draft[row.key] ?? row.value}
              onChange={(e) => setDraft({ ...draft, [row.key]: e.target.value })}
            />
          </label>
          <button onClick={() => save(row.key)} className={`mt-3 ${btn}`}>
            Save
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Offices ---------------- */

function OfficesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_offices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offices").select("*").order("sort_order");
      if (error) throw error;
      return data as Office[];
    },
  });

  async function save(o: Office) {
    const { error } = await supabase
      .from("offices")
      .update({
        name: o.name,
        address: o.address,
        phones: o.phones,
        email: o.email,
        website: o.website,
        sort_order: o.sort_order,
      })
      .eq("id", o.id);
    if (error) return toast.error(error.message);
    toast.success("Office saved");
    qc.invalidateQueries({ queryKey: ["admin_offices"] });
    qc.invalidateQueries({ queryKey: ["offices"] });
  }

  async function add() {
    const { error } = await supabase
      .from("offices")
      .insert({ name: "New Office", sort_order: (data?.length ?? 0) + 1 });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_offices"] });
    qc.invalidateQueries({ queryKey: ["offices"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("offices").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_offices"] });
    qc.invalidateQueries({ queryKey: ["offices"] });
  }

  return (
    <div>
      <button onClick={add} className={`${btn} inline-flex items-center gap-2`}>
        <Plus className="h-4 w-4" /> Add office
      </button>
      <div className="mt-6 space-y-4">
        {(data ?? []).map((o) => (
          <OfficeRow key={o.id} office={o} onSave={save} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}

function OfficeRow({
  office,
  onSave,
  onDelete,
}: {
  office: Office;
  onSave: (o: Office) => void;
  onDelete: (id: string) => void;
}) {
  const [o, setO] = useState(office);
  useEffect(() => setO(office), [office]);

  return (
    <div className="border border-border bg-card p-5">
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["name", "Office name"],
            ["address", "Address"],
            ["phones", "Phone numbers"],
            ["email", "Email"],
            ["website", "Website"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
            {label}
            <input
              className={`mt-1 ${field}`}
              value={o[key]}
              onChange={(e) => setO({ ...o, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={() => onSave(o)} className={btn}>
          Save
        </button>
        <button
          onClick={() => onDelete(o.id)}
          className="ml-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-destructive"
        >
          <Trash2 className="h-4 w-4" /> Remove
        </button>
      </div>
    </div>
  );
}

/* ---------------- Submissions ---------------- */

function SubmissionsAdmin({ table }: { table: "consultation_requests" | "case_inquiries" }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_" + table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Record<string, unknown>[];
    },
  });

  async function remove(id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_" + table] });
  }

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No submissions yet.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((row) => (
        <div key={String(row["id"])} className="border border-border bg-card p-5">
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {Object.entries(row)
              .filter(([k, v]) => k !== "id" && v !== null && v !== "")
              .map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="min-w-36 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    {k.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-foreground">{String(v)}</dd>
                </div>
              ))}
          </dl>
          <button
            onClick={() => remove(String(row["id"]))}
            className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      ))}
    </div>
  );
}
