import fallbackProductsData from "./fallback-products.json";
import fallbackCategoriesData from "./fallback-categories.json";

export type MarketInfo = {
  market: string;
  division: string;
  min: number;
  max: number;
  avg: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  category: string;
  categoryLabel: string;
  unit: string;
  unitShort: string;
  price: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change: number;
  dir: "up" | "down" | "flat";
  description: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  markets: MarketInfo[];
};

export type Category = {
  id: string;
  slug: string;
  label: string;
  nameBn: string;
  icon: string;
};

export const categories: Category[] = (fallbackCategoriesData as Array<{ id: string; slug: string; nameBn: string; icon: string }>).map((c) => ({
  id: c.id,
  slug: c.slug,
  label: c.nameBn,
  nameBn: c.nameBn,
  icon: c.icon,
}));

export const categoryAliases: Record<string, string> = {
  dim: "dim-dui",
  moshla: "mosla",
  sobji: "sobji",
  chal: "chal",
  mach: "mach",
  mangsho: "mangsho",
  dal: "dal",
  tel: "tel",
  "dim-dui": "dim-dui",
  mosla: "mosla",
};

export function resolveCategorySlug(slug: string): string {
  return categoryAliases[slug] || slug;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const resolved = resolveCategorySlug(slug);
  return categories.find((c) => c.slug === resolved);
}

export const products: Product[] = fallbackProductsData as unknown as Product[];

export const toBangla = (value: number | string): string => {
  return String(value).replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
};

export const money = (value: number): string => {
  const rounded = Math.round(value);
  return `${toBangla(rounded.toLocaleString("en-US"))} টাকা`;
};

export function formatChange(changeVal: number | { dir?: string; pct?: number }): {
  badge: string;
  dir: "up" | "down" | "flat";
  pct: number;
} {
  let pct = 0;
  let dir: "up" | "down" | "flat" = "flat";

  if (typeof changeVal === "object" && changeVal !== null) {
    pct = Number(changeVal.pct || 0);
    dir = (changeVal.dir as "up" | "down" | "flat") || (pct > 0 ? "up" : pct < 0 ? "down" : "flat");
  } else {
    pct = Number(changeVal || 0);
    dir = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  }

  if (pct > 0 || dir === "up") {
    return {
      badge: `▲ ${toBangla(Math.abs(pct).toFixed(1))}%`,
      dir: "up",
      pct,
    };
  }

  if (pct < 0 || dir === "down") {
    return {
      badge: `▼ ${toBangla(Math.abs(pct).toFixed(1))}%`,
      dir: "down",
      pct,
    };
  }

  return {
    badge: `—০.০%`,
    dir: "flat",
    pct: 0,
  };
}

export function parseUnit(rawUnit?: string): { full: string; short: string } {
  const u = (rawUnit || "").toLowerCase().trim();
  if (u === "kg" || u.includes("কেজি")) return { full: "প্রতি কেজি", short: "কেজি" };
  if (u === "litre" || u === "liter" || u.includes("লিটার")) return { full: "প্রতি লিটার", short: "লিটার" };
  if (u === "dozen" || u.includes("ডজন")) return { full: "প্রতি ডজন", short: "ডজন" };
  if (u === "piece" || u.includes("পিস")) return { full: "প্রতি পিস", short: "পিস" };
  if (u.startsWith("প্রতি ")) return { full: u, short: u.replace("প্রতি ", "") };
  return { full: rawUnit ? `প্রতি ${rawUnit}` : "প্রতি কেজি", short: rawUnit || "কেজি" };
}

export function getBanglaDate(): string {
  const now = new Date();
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const dayName = days[now.getDay()];
  const dateNum = toBangla(now.getDate());
  const monthName = months[now.getMonth()];
  const yearNum = toBangla(now.getFullYear());
  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}

type ApiProduct = {
  id?: number;
  slug?: string;
  name?: string;
  nameBn?: string;
  category?: string;
  categoryLabel?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  emoji?: string;
  image?: string;
  price?: number;
  today?: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: number | { dir?: string; pct?: number };
  markets?: { market: string; division: string; min: number; max: number }[];
};

export function normalizeProduct(item: ApiProduct, index: number): Product {
  const fallback = products[index % products.length];
  const unitInfo = parseUnit(item.unit || fallback.unitShort);
  const price = Number(item.today ?? item.price ?? fallback.price);

  let change = 0;
  let dir: "up" | "down" | "flat" = "flat";
  if (typeof item.change === "object" && item.change !== null) {
    change = Number(item.change.pct || 0);
    dir = (item.change.dir as "up" | "down" | "flat") || (change > 0 ? "up" : change < 0 ? "down" : "flat");
  } else if (typeof item.change === "number") {
    change = item.change;
    dir = change > 0 ? "up" : change < 0 ? "down" : "flat";
  } else {
    change = fallback.change;
    dir = fallback.dir;
  }

  const markets: MarketInfo[] = item.markets?.length
    ? item.markets.map((m) => ({
        market: m.market,
        division: m.division,
        min: Number(m.min),
        max: Number(m.max),
        avg: Math.round((Number(m.min) + Number(m.max)) / 2),
      }))
    : fallback.markets;

  const minPrice = markets.length ? Math.min(...markets.map((m) => m.min)) : price;
  const maxPrice = markets.length ? Math.max(...markets.map((m) => m.max)) : price;
  const avgPrice = markets.length ? Math.round(markets.reduce((s, m) => s + m.avg, 0) / markets.length) : price;

  const name = item.nameBn || item.name || fallback.name;

  return {
    id: Number(item.id || index + 1),
    slug: item.slug || fallback.slug,
    name,
    emoji: item.image || item.emoji || item.categoryIcon || fallback.emoji,
    category: item.category || fallback.category,
    categoryLabel: item.categoryNameBn || item.categoryLabel || fallback.categoryLabel,
    unit: unitInfo.full,
    unitShort: unitInfo.short,
    price: Number.isFinite(price) ? price : fallback.price,
    yesterday: item.yesterday,
    lastWeek: item.lastWeek,
    lastMonth: item.lastMonth,
    change,
    dir,
    description: `${name}-এর আজকের বাজারদর ও দেশের প্রধান বাজারগুলোর তথ্য।`,
    minPrice,
    maxPrice,
    avgPrice,
    markets,
  };
}