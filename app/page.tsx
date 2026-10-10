"use client";

import { getBanglaDate } from "./data";
import { MarketBasketIllustration, ProductGrid, Shell, SkeletonGrid, useProducts } from "./ui";

export default function Home() {
  const { items, loading } = useProducts();

  // Top 6 risers (positive change sorted highest first)
  const risers = [...items]
    .filter((a) => a.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  // Top 6 fallers (negative change sorted lowest/biggest drop first)
  const fallers = [...items]
    .filter((a) => a.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <Shell>
      {/* 2. Hero / Banner (Exact Figma Match) */}
      <section className="hero-figma-card">
        <div className="hero-content-col">
          <div className="hero-date-pill">
            <span>{getBanglaDate()}</span>
          </div>
          <h1 className="hero-main-heading">আজকের বাজারের দাম এক নজরে</h1>
          <p className="hero-subheading">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div className="hero-action-row">
            <a href="#সব-পণ্য" className="hero-cta-btn" id="cta-explore-products">
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        <div className="hero-media-col">
          <MarketBasketIllustration />
        </div>
      </section>

      {/* 3. The Product Sections (Home Page - Exact Figma Match) */}
      <div className="home-sections-wrap">
        {/* Section A: আজ দাম বেড়েছে ▲ */}
        <section className="market-section rise-section">
          <div className="section-header-row">
            <h2 className="section-title title-rise">
              <span className="arrow-rise" aria-hidden="true">▲</span> আজ দাম বেড়েছে
            </h2>
          </div>
          {loading ? <SkeletonGrid count={6} /> : <ProductGrid items={risers} />}
        </section>

        {/* Section B: আজ দাম কমেছে ▼ */}
        <section className="market-section fall-section">
          <div className="section-header-row">
            <h2 className="section-title title-fall">
              <span className="arrow-fall" aria-hidden="true">▼</span> আজ দাম কমেছে
            </h2>
          </div>
          {loading ? <SkeletonGrid count={6} /> : <ProductGrid items={fallers} />}
        </section>

        {/* Section C: সব পণ্য */}
        <section className="market-section all-section" id="সব-পণ্য">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">সব পণ্য</h2>
              <p className="section-subtitle">
                দেশের প্রধান বাজারগুলো থেকে সংগৃহীত সকল নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর
              </p>
            </div>
          </div>
          {loading ? <SkeletonGrid count={12} /> : <ProductGrid items={items} />}
        </section>
      </div>
    </Shell>
  );
}