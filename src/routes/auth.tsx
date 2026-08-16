import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Scale } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Administrator Sign In | IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY" },
      { name: "description", content: "Secure sign-in for firm administrators." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Administrator Sign In" },
      { property: "og:description", content: "Secure sign-in for firm administrators." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/auth" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
});

const field =
  "w-full border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/admin" });
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session) navigate({ to: "/admin" });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      if (!data.session) {
        toast.success("Account created. Please check your email to confirm your address.");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-deep px-4 py-16">
      <div className="w-full max-w-md bg-card p-8 shadow-[var(--shadow-elegant)]">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-accent/50">
            <Scale className="h-5 w-5 text-accent-foreground" strokeWidth={1.4} />
          </span>
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Ideal International Law Firm
          </span>
        </Link>
        <h1 className="mt-8 text-2xl">
          {mode === "signin" ? "Administrator Sign In" : "Create Administrator Account"}
        </h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-2 ${field}`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-2 ${field}`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "Create an account" : "Back to sign in"}
        </button>
      </div>
    </div>
  );
}
