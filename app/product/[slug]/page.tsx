import { notFound } from "next/navigation";
import { AuthGuard, ChangeBadge, Shell } from "../../ui";
import { money, products, toBangla } from "../../data";

export const instant = false;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const selected = products.find((item) => item.slug === slug);
  if (!selected) return notFound();
  const product = selected;
  const prices = product.markets.map((market) => market.price);
  return <Shell><AuthGuard><article className="detail-page"><div className="detail-top"><div className="detail-emoji">{product.emoji}</div><div><div className="tag-row"><span>{product.categoryLabel}</span><span>{product.unit}</span></div><h1>{product.name}</h1><p>{product.description}</p></div><ChangeBadge change={product.change} /></div><div className="summary-grid"><div><small>সর্বনিম্ন দাম</small><strong>{money(Math.min(...prices))}</strong></div><div><small>সর্বোচ্চ দাম</small><strong>{money(Math.max(...prices))}</strong></div><div><small>গড় বাজারদর</small><strong>{money(Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length))}</strong></div></div><div className="market-heading"><div><span className="eyebrow">লাইভ বাজার তথ্য</span><h2>বাজারভিত্তিক আজকের দাম</h2></div><span className="live-dot">● লাইভ</span></div><div className="market-list">{product.markets.map((market, index) => <div className="market-row" key={market.name}><span className="market-number">{toBangla(index + 1)}</span><div><strong>{market.name}</strong><p>{market.area} · আপডেট {market.updated}</p></div><b>{money(market.price)}</b></div>)}</div></article></AuthGuard></Shell>;
}