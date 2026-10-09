"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { categories, money, Product, products, toBangla } from "./data";

function formatCurrentDateTime(date: Date) {
  const dateText = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
  const timeText = new Intl.DateTimeFormat("bn-BD", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(date);

  return `আজ ${dateText} · ${timeText}`;
}

export function LiveDateTime() {
  const [dateTime, setDateTime] = useState<string | null>(null);

  useEffect(() => {
    const updateDateTime = () => setDateTime(formatCurrentDateTime(new Date()));
    updateDateTime();
    const interval = window.setInterval(updateDateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return <small className="live-date-time">{dateTime ?? "তারিখ ও সময় লোড হচ্ছে..."}</small>;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => { queueMicrotask(() => setUser(localStorage.getItem("bazardor-user"))); }, []);
  const signOut = () => { localStorage.removeItem("bazardor-user"); setUser(null); toast.success("আপনি সফলভাবে সাইন আউট করেছেন"); router.push("/"); };
  return <header className="site-header"><div className="nav-wrap"><Link href="/" className="brand"><span className="brand-mark">🛒</span><span><strong>বাজার দর</strong><LiveDateTime /></span></Link><nav className="main-nav" aria-label="প্রধান নেভিগেশন"><Link className={pathname === "/" ? "active" : ""} href="/">হোম</Link>{categories.map((category) => <Link key={category.slug} className={pathname === `/category/${category.slug}` ? "active" : ""} href={`/category/${category.slug}`}>{category.label}</Link>)}</nav><div className="auth-nav">{user ? <><Link href="/profile" className="profile-pill">{user}</Link><button onClick={signOut} className="text-button">সাইন আউট</button></> : <><Link href="/signin" className="text-button">সাইন ইন</Link><Link href="/signup" className="signup-button">সাইন আপ <span>↗</span></Link></>}</div></div><div className="ticker"><div className="ticker-track">{[...products, ...products].map((product, index) => <span key={`${product.id}-${index}`}><b>{product.emoji}</b> {product.name} <strong>{money(product.price)}</strong> <i className={product.change >= 0 ? "up" : "down"}>{product.change >= 0 ? "▲" : "▼"} {toBangla(Math.abs(product.change))}%</i></span>)}</div></div></header>;
}

export function Footer() { return <footer><div><span className="footer-logo">বাজার দর</span><p>প্রয়োজনীয় পণ্যের দাম এক নজরে।</p></div><p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p></footer>; }
export function Shell({ children }: { children: React.ReactNode }) { return <><Header /><main>{children}</main><Footer /><Toaster position="top-right" toastOptions={{ duration: 2800, style: { border: "1px solid #e2e5dc", borderRadius: "4px", fontFamily: "inherit" } }} /></>; }
export function ProductCard({ product }: { product: Product }) { return <Link href={`/product/${product.slug}`} className="product-card"><div className="product-emoji">{product.emoji}</div><div className="product-info"><span className="category-label">{product.categoryLabel}</span><h3>{product.name}</h3><p>{product.unit}</p><div className="price-row"><div><small>আজকের দাম</small><strong>{money(product.price)}</strong></div><ChangeBadge change={product.change} /></div></div></Link>; }
export function ChangeBadge({ change }: { change: number }) { return <span className={`change-badge ${change > 0 ? "up" : change < 0 ? "down" : "flat"}`}>{change > 0 ? "▲" : change < 0 ? "▼" : "—"} {toBangla(Math.abs(change))}%</span>; }
export function ProductGrid({ items }: { items: Product[] }) { return <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>; }
export function SkeletonGrid() { return <div className="product-grid">{Array.from({ length: 6 }).map((_, index) => <div className="skeleton-card" key={index}><div className="skeleton circle" /><div className="skeleton line" /><div className="skeleton short" /><div className="skeleton price" /></div>)}</div>; }
export function BackHome() { return <Link className="primary-button" href="/">হোম পেজে ফিরে যান <span>↗</span></Link>; }
export function AuthGuard({ children }: { children: React.ReactNode }) { const router = useRouter(); const pathname = usePathname(); const [ready, setReady] = useState(false); useEffect(() => { queueMicrotask(() => { if (!localStorage.getItem("bazardor-user")) { toast.error("এই পেজ দেখতে আগে সাইন ইন করুন"); router.replace(`/signin?next=${encodeURIComponent(pathname)}`); } else setReady(true); }); }, [pathname, router]); return ready ? children : <div className="auth-loading"><div className="spinner" />অ্যাকাউন্ট যাচাই হচ্ছে...</div>; }
type ApiProduct = { id?: number; slug?: string; name?: string; nameBn?: string; category?: string; categoryLabel?: string; categoryNameBn?: string; unit?: string; emoji?: string; image?: string; price?: number; today?: number; change?: number | { pct?: number }; markets?: { market: string; division: string; min: number; max: number }[] };
export function useProducts() { const [items, setItems] = useState<Product[]>([]); const [loading, setLoading] = useState(true); useEffect(() => { const controller = new AbortController(); const load = async () => { try { let response = await fetch("https://api.api-store.workers.dev/api/bazardor/products", { signal: controller.signal }); if (!response.ok) response = await fetch("https://api.abcz.workers.dev/api/bazardor/products", { signal: controller.signal }); if (!response.ok) throw new Error("Products request failed"); const data = await response.json(); if (!Array.isArray(data)) throw new Error("Unexpected products response"); const remote = data.map((item: ApiProduct, index: number) => { const fallback = products[index % products.length]; const price = Number(item.price ?? item.today ?? fallback.price); const change = typeof item.change === "object" ? Number(item.change.pct) : Number(item.change); const markets = item.markets?.length ? item.markets.map((market) => ({ name: market.market, area: market.division, price: Math.round((market.min + market.max) / 2), updated: "আজ" })) : fallback.markets; return { ...fallback, ...item, name: item.name || item.nameBn || fallback.name, emoji: item.emoji || item.image || fallback.emoji, categoryLabel: item.categoryLabel || item.categoryNameBn || fallback.categoryLabel, slug: item.slug || fallback.slug, id: Number(item.id || index + 1), price: Number.isFinite(price) ? price : fallback.price, change: Number.isFinite(change) ? change : fallback.change, markets }; }); setItems(remote); } catch { if (!controller.signal.aborted) setItems(products); } finally { if (!controller.signal.aborted) setLoading(false); } }; void load(); return () => controller.abort(); }, []); return { items: items.length ? items : products, loading }; }