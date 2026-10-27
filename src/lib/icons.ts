/**
 * Lucide icons used on the site (Doc 05 §5.1 — outline, rounded).
 * Only the icons listed here end up in the build; add one by importing it.
 */
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Camera,
  Check,
  FileSignature,
  House,
  KeyRound,
  Languages,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  UserCheck,
  Users,
  X,
} from "lucide-static";

export const icons = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  calendar: Calendar,
  camera: Camera,
  check: Check,
  "file-signature": FileSignature,
  house: House,
  "key-round": KeyRound,
  languages: Languages,
  mail: Mail,
  "map-pin": MapPin,
  menu: Menu,
  "message-circle": MessageCircle,
  phone: Phone,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  star: Star,
  "user-check": UserCheck,
  users: Users,
  x: X,
} as const;

export type IconName = keyof typeof icons;
