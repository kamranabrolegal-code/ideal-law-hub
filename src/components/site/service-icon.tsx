import {
  Scale,
  Gavel,
  Landmark,
  Users,
  Shield,
  Building2,
  Megaphone,
  BookOpen,
  Briefcase,
  Handshake,
  FileText,
  Receipt,
  Calculator,
  Ship,
  Plane,
  Globe,
  Globe2,
  BadgeCheck,
  Lightbulb,
  Heart,
  Plus,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  scale: Scale,
  gavel: Gavel,
  landmark: Landmark,
  users: Users,
  shield: Shield,
  building: Building2,
  megaphone: Megaphone,
  bookopen: BookOpen,
  briefcase: Briefcase,
  handshake: Handshake,
  filetext: FileText,
  receipt: Receipt,
  calculator: Calculator,
  ship: Ship,
  plane: Plane,
  globe: Globe,
  globe2: Globe2,
  badgecheck: BadgeCheck,
  lightbulb: Lightbulb,
  heart: Heart,
  plus: Plus,
};

export const ICON_NAMES = Object.keys(MAP);

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Scale;
  return <Icon className={className} strokeWidth={1.4} aria-hidden="true" />;
}
