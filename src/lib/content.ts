import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FIRM_NAME = "IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY";

export type Service = {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  icon: string;
  lawyer: string | null;
  sort_order: number;
  published: boolean;
};

export type Office = {
  id: string;
  name: string;
  address: string;
  phones: string;
  email: string;
  website: string;
  sort_order: number;
};

export const CATEGORY_LABELS: Record<string, string> = {
  legal: "Legal Services",
  corporate: "Corporate & Business Services",
  taxation: "Taxation Services",
  immigration: "Immigration & Visa Services",
  ip: "Intellectual Property",
  other: "Additional Services",
};

/** Practice-area pages built from service slugs. */
export const PRACTICE_AREAS: Record<
  string,
  { title: string; intro: string; slugs: string[] }
> = {
  corporate: {
    title: "Corporate & Business Law",
    intro:
      "Company formation, corporate documentation, contracts, compliance support and legal consultancy for firms, businesses, entrepreneurs and organizations.",
    slugs: ["company", "firm", "corporate-legal"],
  },
  taxation: {
    title: "Taxation",
    intro:
      "Legal and consultancy services relating to income tax, sales tax and customs matters, disputes and proceedings.",
    slugs: ["income-tax", "sales-tax", "customs"],
  },
  immigration: {
    title: "Immigration & Visa",
    intro:
      "Clear categories of legal assistance for individuals and organizations seeking visa, immigration and nationality-related guidance.",
    slugs: ["visa", "nationality"],
  },
  ip: {
    title: "Intellectual Property",
    intro:
      "Intellectual Property Office services and patent-related legal consultancy. Further intellectual-property services can be added by the administrator.",
    slugs: ["ipo", "patent"],
  },
  litigation: {
    title: "Litigation",
    intro:
      "Representation and litigation support before courts, tribunals and quasi-judicial forums across civil, criminal, banking and public-law matters.",
    slugs: ["civil", "criminal", "banking", "tribunal", "public-litigation"],
  },
};

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value, label");
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const row of data ?? []) map[row.key] = row.value;
      return map;
    },
  });
}

export function useOffices() {
  return useQuery({
    queryKey: ["offices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offices").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Office[];
    },
  });
}

export const FALLBACK: Record<string, string> = {
  hero_title: FIRM_NAME,
  hero_subtitle: "Professional Legal & Consultancy Services",
  hero_description:
    "We provide reliable legal representation, litigation support, consultancy and business-related legal services for individuals, companies, organizations and institutions.",
  ceo_name: "H D AZAD",
  ceo_title: "CEO",
  advocate_name: "Kamran Abro, Advocate",
  disclaimer:
    "The information provided on this website is for general informational purposes only and does not by itself constitute legal advice or create an advocate-client relationship.",
};

export function text(map: Record<string, string> | undefined, key: string) {
  return map?.[key] || FALLBACK[key] || "";
}
