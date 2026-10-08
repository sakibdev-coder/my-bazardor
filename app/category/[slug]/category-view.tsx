"use client";

import { useState } from "react";
import { categories } from "../../data";
import { BackHome, ProductGrid, Shell, SkeletonGrid, useProducts } from "../../ui";

export default function CategoryView({ slug }: { slug: string }) {
  const { items, loading } = useProducts();
  const category = categories.find((item) => item.slug === slug);
  const [sort, setSort] = useState("default");
  if (!category) return <Shell><EmptyState /></Shell>;
  const filtered = items.filter((item) => item.category === slug);
  const sorted = [...filtered].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id);
  return <Shell><div className="page-intro"><div><span className="eyebrow">ক্যাটাগরি</span><h1>{category.icon} {category.label}</h1><p>আজকের {category.label} বাজারের সর্বশেষ দর</p></div><label className="sort-control">সাজান <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">ডিফল্ট</option><option value="low">দাম: কম থেকে বেশি</option><option value="high">দাম: বেশি থেকে কম</option></select><span>⌄</span></label></div><div className="category-line" />{loading ? <SkeletonGrid /> : filtered.length ? <ProductGrid items={sorted} /> : <EmptyState />}</Shell>;
}

function EmptyState() { return <div className="empty-state"><div>🧺</div><h2>এই ক্যাটাগরিতে কিছু পাওয়া যায়নি</h2><p>অন্য কোনো ক্যাটাগরি দেখে নিন।</p><BackHome /></div>; }