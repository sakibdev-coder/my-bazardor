"use client";

import { useMemo, useState } from "react";
import { getCategoryBySlug, resolveCategorySlug } from "../../data";
import { BackHome, ProductGrid, Shell, SkeletonGrid, useProducts } from "../../ui";

export default function CategoryView({ slug }: { slug: string }) {
  const { items, loading } = useProducts();
  const [sort, setSort] = useState<"default" | "low" | "high">("default");

  const resolvedSlug = resolveCategorySlug(slug);
  const category = getCategoryBySlug(slug);

  const filtered = useMemo(() => {
    return items.filter(
      (item) => item.category === resolvedSlug || item.category === slug
    );
  }, [items, resolvedSlug, slug]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "low") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sort === "high") {
      return list.sort((a, b) => b.price - a.price);
    }
    return list.sort((a, b) => a.id - b.id);
  }, [filtered, sort]);

  if (!category) {
    return (
      <Shell>
        <EmptyState title="ক্যাটাগরি পাওয়া যায়নি" subtitle="অনুরোধকৃত ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।" />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="page-intro">
        <div className="intro-copy">
          <span className="eyebrow">ক্যাটাগরি অনুযায়ী বাজারদর</span>
          <h1>
            <span className="cat-icon" aria-hidden="true">{category.icon}</span> {category.label}
          </h1>
          <p>আজকের বাজারে {category.label} ক্যাটাগরির সমস্ত পণ্যের সর্বশেষ ও নির্ভরযোগ্য মূল্যতালিকা।</p>
        </div>

        {/* Sort control dropdown (C1) */}
        <div className="sort-container">
          <label className="sort-control" htmlFor="sort-select">
            <span className="sort-label">সাজান:</span>
            <div className="select-wrapper">
              <select
                id="sort-select"
                value={sort}
                onChange={(event) => setSort(event.target.value as "default" | "low" | "high")}
                className="sort-dropdown"
              >
                <option value="default">ডিফল্ট</option>
                <option value="low">দাম: কম থেকে বেশি</option>
                <option value="high">দাম: বেশি থেকে কম</option>
              </select>
              <span className="select-chevron" aria-hidden="true">▾</span>
            </div>
          </label>
        </div>
      </div>

      <div className="category-line" />

      {loading ? (
        <SkeletonGrid count={8} />
      ) : sorted.length ? (
        <div className="category-products-wrap">
          <ProductGrid items={sorted} />
        </div>
      ) : (
        <EmptyState
          title="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"
          subtitle="বর্তমানে এই ক্যাটাগরিতে তথ্য হালনাগাদ করা হচ্ছে। অন্য ক্যাটাগরি ঘুরে দেখুন।"
        />
      )}
    </Shell>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon" aria-hidden="true">🧺</div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <BackHome />
    </div>
  );
}