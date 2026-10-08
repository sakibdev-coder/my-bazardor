import CategoryView from "./category-view";
import { categories } from "../../data";
import { notFound } from "next/navigation";

export const instant = false;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!categories.some((category) => category.slug === slug)) notFound();
  return <CategoryView slug={slug} />;
}