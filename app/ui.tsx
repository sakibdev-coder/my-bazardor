"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  categories,
  formatChange,
  money,
  normalizeProduct,
  Product,
  products,
} from "./data";
import { clearClientSession, getClientSession, UserSession } from "@/lib/auth-client";

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
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useProducts();

  useEffect(() => {
    const syncSession = () => {
      const sess = getClientSession();
      // Default to Rezwan if demo session is requested, or user session
      setSession(sess);
    };
    syncSession();
    queueMicrotask(() => setMounted(true));

    window.addEventListener("bazardor-auth-change", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("bazardor-auth-change", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const signOut = () => {
    clearClientSession();
    setSession(null);
    setMenuOpen(false);
    toast.success("আপনি সফলভাবে সাইন আউট করেছেন");
    router.push("/");
  };

  const tickerList = items.length ? items : products;

  return (
    <header className="site-header">
      {/* 1. Top Navbar Row: Logo + Date on Left | Profile Dropdown on Right */}
      <div className="nav-top-row">
        <div className="nav-top-inner">
          <Link href="/" className="brand" aria-label="বাজার দর হোমপেজ">
            <div className="brand-icon-box">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="brand-cart-svg"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div className="brand-text-col">
              <strong className="brand-title">বাজার দর</strong>
              <LiveDateTime />
            </div>
          </Link>

          <div className="auth-nav">
            {mounted && session ? (
              <div className="user-dropdown-wrap">
                <button
                  type="button"
                  className="user-menu-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                  id="user-profile-menu-button"
                >
                  <div className="user-avatar-circle">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt={session.name}
                      onError={(e) => {
                        // Fallback to initial if image fails
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="avatar-fallback-initial">
                      {session.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="user-menu-name">{session.name}</span>
                  <span className="user-menu-chevron" aria-hidden="true">▾</span>
                </button>

                {menuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{session.name}</strong>
                      <small>{session.email}</small>
                    </div>
                    <Link
                      href="/profile"
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span aria-hidden="true">👤</span> আমার প্রোফাইল
                    </Link>
                    <Link
                      href="/profile/update"
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span aria-hidden="true">✏️</span> তথ্য আপডেট করুন
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      onClick={signOut}
                      className="dropdown-item dropdown-logout"
                    >
                      <span aria-hidden="true">🚪</span> সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="guest-auth-buttons">
                <Link href="/signin" className="text-button">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="signup-button">
                  সাইন আপ <span aria-hidden="true">↗</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Centered Category Navigation */}
      <div className="nav-categories-row">
        <nav className="centered-category-nav" aria-label="ক্যাটাগরি নেভিগেশন">
          <Link
            className={`cat-nav-link ${pathname === "/" ? "active" : ""}`}
            href="/"
          >
            <span className="cat-dot">🏠</span>
            <span>হোম</span>
          </Link>
          {categories.map((category) => {
            const isActive = pathname === `/category/${category.slug}`;
            return (
              <Link
                key={category.slug}
                className={`cat-nav-link ${isActive ? "active" : ""}`}
                href={`/category/${category.slug}`}
              >
                <span className="cat-dot">{category.icon}</span>
                <span>{category.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Third Row: Marquee Price Ticker with vertical divider borders */}
      <div className="ticker" aria-label="লাইভ বাজারদর স্ক্রল">
        <div className="ticker-track">
          {[...tickerList, ...tickerList].map((product, index) => {
            const changeInfo = formatChange(product.change);
            return (
              <span key={`${product.id}-${index}`} className="ticker-cell">
                <span className="ticker-icon" aria-hidden="true">{product.emoji}</span>
                <span className="ticker-title">{product.name}</span>
                <span className="ticker-val">
                  {money(product.price)}/{product.unitShort}
                </span>
                <span className={`ticker-delta ${changeInfo.dir}`}>
                  {changeInfo.badge}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🛒 বাজার দর</span>
          <p>প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        </div>
        <div className="footer-disclaimer">
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
          <small>© ২০২৬ বাজার দর | সর্বস্বত্ব সংরক্ষিত</small>
        </div>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-layout">
      <Suspense fallback={<header className="site-header" />}>
        <Header />
      </Suspense>
      <main id="main-content">{children}</main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#1e2925",
            border: "1px solid #d5ddce",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            fontFamily: "inherit",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#287b59",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#d65f58",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
}

export function ChangeBadge({ change }: { change: number | { dir?: string; pct?: number } }) {
  const { badge, dir } = formatChange(change);
  return <span className={`change-badge ${dir}`}>{badge}</span>;
}

export function MarketBasketIllustration() {
  return (
    <div className="hero-basket-art" aria-hidden="true">
      <svg
        viewBox="0 0 320 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="basket-svg"
      >
        {/* Soft ground shadow */}
        <ellipse cx="160" cy="242" rx="105" ry="12" fill="#e5e7eb" />

        {/* Purple plum / grapes on left */}
        <circle cx="88" cy="180" r="22" fill="#a855f7" />
        <path d="M88 158 C88 150 92 144 98 140" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />

        {/* Red apple */}
        <circle cx="120" cy="160" r="32" fill="#ef4444" />
        <ellipse cx="112" cy="148" rx="8" ry="14" fill="#f87171" opacity="0.6" />
        <path d="M120 128 C120 118 126 112 134 108" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />

        {/* Big Green Apple in center */}
        <circle cx="180" cy="150" r="38" fill="#10b981" />
        <ellipse cx="170" cy="136" rx="9" ry="16" fill="#34d399" opacity="0.6" />
        <path d="M180 112 C180 98 188 90 200 86" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
        <path d="M180 102 C170 94 165 96 162 104 C162 110 172 108 180 102Z" fill="#059669" />
        <path d="M185 102 C196 92 204 96 205 104 C205 110 192 108 185 102Z" fill="#047857" />

        {/* Bright orange tomato / citrus */}
        <circle cx="152" cy="190" r="24" fill="#f97316" />
        <path d="M152 166 C152 160 156 156 160 154" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />

        {/* Yellow-orange citrus on right */}
        <circle cx="225" cy="186" r="26" fill="#eab308" />
        <ellipse cx="218" cy="176" rx="6" ry="10" fill="#facc15" opacity="0.6" />
        <path d="M225 160 C225 152 230 148 236 146" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        <path d="M228 152 C236 146 242 148 243 154 C243 158 234 156 228 152Z" fill="#15803d" />

        {/* Wooden Basket */}
        <path
          d="M65 190 L85 240 C86 244 90 246 95 246 L225 246 C230 246 234 244 235 240 L255 190 Z"
          fill="#9a5b28"
        />
        <path d="M78 190 L95 246" stroke="#783e15" strokeWidth="3.5" />
        <path d="M102 190 L115 246" stroke="#783e15" strokeWidth="3.5" />
        <path d="M128 190 L136 246" stroke="#783e15" strokeWidth="3.5" />
        <path d="M156 190 L158 246" stroke="#783e15" strokeWidth="3.5" />
        <path d="M184 190 L180 246" stroke="#783e15" strokeWidth="3.5" />
        <path d="M212 190 L202 246" stroke="#783e15" strokeWidth="3.5" />
        <path d="M238 190 L223 246" stroke="#783e15" strokeWidth="3.5" />

        {/* Basket Top Rim */}
        <rect x="58" y="184" width="204" height="12" rx="6" fill="#783e15" />
      </svg>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card"
      id={`product-${product.slug}`}
    >
      <div className="card-top-row">
        <div className="card-icon-box" aria-hidden="true">
          {product.emoji}
        </div>
        <div className="card-title-col">
          <h3 className="card-product-name">{product.name}</h3>
          <span className="card-unit-text">{product.unit}</span>
        </div>
      </div>

      <div className="card-bottom-row">
        <div className="card-price-col">
          <small className="card-price-label">আজকের দাম</small>
          <strong className="card-price-val">{money(product.price)}</strong>
        </div>
        <div className="card-badge-col">
          <ChangeBadge change={product.change} />
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="লোড হচ্ছে...">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton circle" />
          <div className="skeleton line" />
          <div className="skeleton short" />
          <div className="skeleton price" />
        </div>
      ))}
    </div>
  );
}

export function BackHome() {
  return (
    <Link className="primary-button" href="/">
      হোম পেজে ফিরে যান <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (!session) {
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন");
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    } else {
      queueMicrotask(() => setReady(true));
    }
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="auth-loading" role="status">
        <div className="spinner" />
        <p>লগইন যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function useProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        let response = await fetch("https://api.api-store.workers.dev/api/bazardor/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          response = await fetch("https://api.abcz.workers.dev/api/bazardor/products", {
            signal: controller.signal,
          });
        }

        if (!response.ok) throw new Error("API failed");

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid array");

        const remote = data.map((item, index) => normalizeProduct(item, index));
        setItems(remote);
      } catch {
        if (!controller.signal.aborted) {
          setItems(products);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  return { items: items.length ? items : products, loading };
}