"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { toBangla } from "../../data";
import { AuthGuard, BackHome, Shell, useProducts } from "../../ui";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { items, loading } = useProducts();

  const product = useMemo(() => {
    if (!slug) return null;
    return items.find((item) => item.slug === slug || String(item.id) === slug) || null;
  }, [items, slug]);

  const diff = useMemo(() => {
    if (!product) return 0;
    if (product.yesterday && product.yesterday !== product.price) {
      return Math.abs(product.price - product.yesterday);
    }
    if (product.change) {
      return Math.max(1, Math.round(product.price * (Math.abs(product.change) / 100)));
    }
    return 0;
  }, [product]);

  const sortedMarkets = useMemo(() => {
    if (!product?.markets?.length) return [];
    return [...product.markets].sort((a, b) => a.avg - b.avg);
  }, [product]);

  const formatAvg = (val: number): string => {
    if (val % 1 === 0) {
      return `${toBangla(val)} টাকা`;
    }
    return `${toBangla(val.toFixed(2))} টাকা`;
  };

  return (
    <Shell>
      <AuthGuard>
        <div className="detail-page-container" style={{ maxWidth: 980, margin: "0 auto", padding: "32px 16px 64px" }}>
          {loading ? (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div style={{ height: 20, width: 200, background: "#f1f5f2", borderRadius: 6 }} />
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ width: 72, height: 72, background: "#f1f5f2", borderRadius: 18 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 26, width: "40%", background: "#f1f5f2", borderRadius: 6 }} />
                  <div style={{ height: 16, width: "25%", background: "#f1f5f2", borderRadius: 6 }} />
                </div>
              </div>
            </div>
          ) : !product ? (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                padding: "60px 24px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 48, fontWeight: 800, color: "#94a3b8" }}>৪০৪</span>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "12px 0 8px", color: "#0f172a" }}>
                পণ্যটি খুঁজে পাওয়া যায়নি
              </h1>
              <p style={{ color: "#64748b", marginBottom: 24 }}>
                অনুগ্রহ করে লিংকটি সঠিক কি না যাচাই করুন অথবা মূল তালিকায় ফিরে যান।
              </p>
              <BackHome />
            </div>
          ) : (
            <>
              {/* Breadcrumbs Navigation */}
              <nav
                className="detail-breadcrumb-nav"
                aria-label="Breadcrumb"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 20,
                }}
              >
                <Link
                  href="/"
                  className="hover:text-emerald-700 transition-colors"
                  style={{ color: "#475569", textDecoration: "none" }}
                >
                  হোম
                </Link>
                <span className="detail-breadcrumb-sep" style={{ color: "#94a3b8", userSelect: "none" }}>
                  ›
                </span>
                <Link
                  href={`/category/${product.category}`}
                  className="hover:text-emerald-700 transition-colors"
                  style={{ color: "#475569", textDecoration: "none" }}
                >
                  {product.categoryLabel}
                </Link>
                <span className="detail-breadcrumb-sep" style={{ color: "#94a3b8", userSelect: "none" }}>
                  ›
                </span>
                <span style={{ color: "#334155", fontWeight: 500 }}>{product.name}</span>
              </nav>

              {/* 1. Top Hero Product Card */}
              <div
                className="detail-hero-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: "24px 32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  marginBottom: 20,
                }}
              >
                {/* Left Side: Icon + Titles */}
                <div
                  className="detail-hero-info"
                  style={{ display: "flex", alignItems: "center", gap: 20 }}
                >
                  <div
                    className="detail-hero-icon"
                    style={{
                      width: 72,
                      height: 72,
                      background: "#f1f5f2",
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 38,
                      flexShrink: 0,
                      userSelect: "none",
                    }}
                  >
                    {product.emoji || "🛒"}
                  </div>
                  <div className="detail-hero-texts" style={{ display: "flex", flexDirection: "column" }}>
                    <h1
                      className="detail-hero-title"
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                        lineHeight: 1.25,
                      }}
                    >
                      {product.name}
                    </h1>
                    <p
                      className="detail-hero-subtitle"
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        margin: "4px 0 0",
                      }}
                    >
                      {product.unit} · {product.categoryLabel}
                    </p>
                    <p
                      className="detail-hero-diff"
                      style={{
                        fontSize: 13,
                        color: "#475569",
                        margin: "8px 0 0",
                      }}
                    >
                      গতকালকের তুলনায় আজ দাম{" "}
                      <strong style={{ fontWeight: 700, color: "#0f172a" }}>
                        {product.dir === "up" ? "বেড়েছে" : product.dir === "down" ? "কমেছে" : "অপরিবর্তিত"}
                      </strong>
                      {diff > 0 ? ` · ${toBangla(diff)} টাকা` : ""}
                    </p>
                  </div>
                </div>

                {/* Right Side: Price Box */}
                <div
                  className="detail-hero-price-box"
                  style={{
                    background: "#f6f8f6",
                    borderRadius: 14,
                    padding: "12px 24px",
                    textAlign: "center",
                    minWidth: 124,
                    flexShrink: 0,
                    border: "1px solid #edf2ee",
                  }}
                >
                  <div
                    className="detail-price-label"
                    style={{ fontSize: 11, color: "#64748b", fontWeight: 500, marginBottom: 2 }}
                  >
                    আজকের দাম
                  </div>
                  <div
                    className="detail-price-num"
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      color: "#0f172a",
                      lineHeight: 1.05,
                      margin: "2px 0",
                    }}
                  >
                    {toBangla(product.price)}
                  </div>
                  <div
                    className="detail-price-unit"
                    style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}
                  >
                    টাকা / {product.unitShort}
                  </div>
                  <div
                    className={`detail-price-change ${product.dir}`}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                      color:
                        product.dir === "up"
                          ? "#dc2626"
                          : product.dir === "down"
                          ? "#16a34a"
                          : "#64748b",
                    }}
                  >
                    <span>{product.dir === "up" ? "▲" : product.dir === "down" ? "▼" : "—"}</span>
                    <span>{toBangla(Math.abs(product.change).toFixed(1))}%</span>
                  </div>
                </div>
              </div>

              {/* 2. Lower Content Card (দামের সারসংক্ষেপ + বাজারভিত্তিক আজকের দাম) */}
              <div
                className="detail-content-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: "28px 32px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                {/* Part A: দামের সারসংক্ষেপ */}
                <h2
                  className="detail-section-title"
                  style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0" }}
                >
                  দামের সারসংক্ষেপ
                </h2>

                <div
                  className="detail-summary-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    marginBottom: 8,
                  }}
                >
                  {/* Card 1: সর্বনিম্ন দাম */}
                  <div
                    className="detail-summary-card"
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "16px 20px",
                      background: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="detail-summary-card-title"
                      style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}
                    >
                      সর্বনিম্ন দাম
                    </div>
                    <div
                      className="detail-summary-card-price green"
                      style={{ fontSize: 22, fontWeight: 700, color: "#059669", margin: "2px 0" }}
                    >
                      {toBangla(product.minPrice)} টাকা
                    </div>
                    <div
                      className="detail-summary-card-note"
                      style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}
                    >
                      সবচেয়ে কম দামের বাজার
                    </div>
                  </div>

                  {/* Card 2: সর্বাধিক দাম */}
                  <div
                    className="detail-summary-card"
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "16px 20px",
                      background: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="detail-summary-card-title"
                      style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}
                    >
                      সর্বাধিক দাম
                    </div>
                    <div
                      className="detail-summary-card-price red"
                      style={{ fontSize: 22, fontWeight: 700, color: "#e11d48", margin: "2px 0" }}
                    >
                      {toBangla(product.maxPrice)} টাকা
                    </div>
                    <div
                      className="detail-summary-card-note"
                      style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}
                    >
                      সবচেয়ে বেশি দামের বাজার
                    </div>
                  </div>

                  {/* Card 3: গড় দাম */}
                  <div
                    className="detail-summary-card"
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "16px 20px",
                      background: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="detail-summary-card-title"
                      style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}
                    >
                      গড় দাম
                    </div>
                    <div
                      className="detail-summary-card-price green"
                      style={{ fontSize: 22, fontWeight: 700, color: "#059669", margin: "2px 0" }}
                    >
                      {toBangla(product.avgPrice)} টাকা
                    </div>
                    <div
                      className="detail-summary-card-note"
                      style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}
                    >
                      প্রতি {product.unitShort}-এর হিসাবে
                    </div>
                  </div>
                </div>

                {/* Part B: বাজারভিত্তিক আজকের দাম */}
                <h2
                  className="detail-section-title mt"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0f172a",
                    marginTop: 32,
                    marginBottom: 16,
                  }}
                >
                  বাজারভিত্তিক আজকের দাম
                </h2>

                <div
                  className="detail-table-card"
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#ffffff",
                  }}
                >
                  <div className="detail-table-wrapper" style={{ overflowX: "auto" }}>
                    <table
                      className="detail-market-table"
                      style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}
                    >
                      <thead>
                        <tr style={{ background: "#f8faf8", borderBottom: "1px solid #e2e8f0" }}>
                          <th
                            style={{
                              padding: "12px 20px",
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#64748b",
                              textAlign: "left",
                            }}
                          >
                            বাজার
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#64748b",
                              textAlign: "left",
                            }}
                          >
                            বিভাগ
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#64748b",
                              textAlign: "center",
                            }}
                          >
                            সর্বনিম্ন
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#64748b",
                              textAlign: "center",
                            }}
                          >
                            সর্বাধিক
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#64748b",
                              textAlign: "right",
                            }}
                          >
                            গড়
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedMarkets.map((m, index) => (
                          <tr
                            key={`${m.market}-${index}`}
                            style={{
                              borderTop: "1px solid #f1f5f2",
                              transition: "background-color 0.15s ease",
                            }}
                            className="hover:bg-[#fafcfa]"
                          >
                            <td
                              style={{
                                padding: "12px 20px",
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#0f172a",
                              }}
                            >
                              {m.market}
                            </td>
                            <td
                              style={{
                                padding: "12px 20px",
                                fontSize: 13,
                                color: "#475569",
                              }}
                            >
                              {m.division}
                            </td>
                            <td
                              style={{
                                padding: "12px 20px",
                                fontSize: 13,
                                color: "#334155",
                                textAlign: "center",
                              }}
                            >
                              {toBangla(m.min)} টাকা
                            </td>
                            <td
                              style={{
                                padding: "12px 20px",
                                fontSize: 13,
                                color: "#334155",
                                textAlign: "center",
                              }}
                            >
                              {toBangla(m.max)} টাকা
                            </td>
                            <td
                              style={{
                                padding: "12px 20px",
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#0f172a",
                                textAlign: "right",
                              }}
                            >
                              {formatAvg(m.avg)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AuthGuard>
    </Shell>
  );
}