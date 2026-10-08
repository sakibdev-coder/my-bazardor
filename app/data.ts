export type Product = {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  category: string;
  categoryLabel: string;
  unit: string;
  price: number;
  change: number;
  description: string;
  markets: { name: string; area: string; price: number; updated: string }[];
};

export const products: Product[] = [
  { id: 1, slug: "miniket-chal", name: "মিনিকেট চাল", emoji: "🍚", category: "chal", categoryLabel: "চাল", unit: "প্রতি কেজি", price: 78, change: 2.1, description: "নিত্যদিনের পছন্দের সরু চাল, পরিষ্কার ও ঝরঝরে।", markets: [{ name: "কারওয়ান বাজার", area: "ঢাকা", price: 78, updated: "১০ মিনিট আগে" }, { name: "মিরপুর ১ বাজার", area: "ঢাকা", price: 80, updated: "২৪ মিনিট আগে" }, { name: "চট্টগ্রাম রিয়াজউদ্দিন", area: "চট্টগ্রাম", price: 76, updated: "৪০ মিনিট আগে" }] },
  { id: 2, slug: "soyabean-tel", name: "সয়াবিন তেল", emoji: "🫙", category: "tel", categoryLabel: "তেল", unit: "প্রতি লিটার", price: 172, change: -1.4, description: "পরিবারের প্রতিদিনের রান্নার নির্ভরযোগ্য তেল।", markets: [{ name: "নিউ মার্কেট", area: "ঢাকা", price: 172, updated: "১২ মিনিট আগে" }, { name: "বহদ্দারহাট", area: "চট্টগ্রাম", price: 175, updated: "৩১ মিনিট আগে" }] },
  { id: 3, slug: "aloo", name: "আলু", emoji: "🥔", category: "sobji", categoryLabel: "সবজি", unit: "প্রতি কেজি", price: 32, change: -3.2, description: "দেশি গোল আলু, আজকের বাজারে সবচেয়ে ভালো দামে।", markets: [{ name: "কারওয়ান বাজার", area: "ঢাকা", price: 32, updated: "৮ মিনিট আগে" }, { name: "খুলনা বড় বাজার", area: "খুলনা", price: 35, updated: "৫২ মিনিট আগে" }] },
  { id: 4, slug: "peyaj", name: "পেঁয়াজ", emoji: "🧅", category: "sobji", categoryLabel: "সবজি", unit: "প্রতি কেজি", price: 88, change: 4.8, description: "দেশি পেঁয়াজের আজকের পাইকারি ও খুচরা দর।", markets: [{ name: "শ্যামবাজার", area: "ঢাকা", price: 88, updated: "১৫ মিনিট আগে" }, { name: "চকবাজার", area: "চট্টগ্রাম", price: 92, updated: "৪৫ মিনিট আগে" }] },
  { id: 5, slug: "morich", name: "কাঁচা মরিচ", emoji: "🌶️", category: "sobji", categoryLabel: "সবজি", unit: "প্রতি কেজি", price: 210, change: 6.3, description: "ঝাল-ঝাল সতেজ কাঁচা মরিচ, বাজারদর প্রতিদিন আপডেট।", markets: [{ name: "কারওয়ান বাজার", area: "ঢাকা", price: 210, updated: "৬ মিনিট আগে" }, { name: "মৌলভীবাজার", area: "সিলেট", price: 225, updated: "১ ঘণ্টা আগে" }] },
  { id: 6, slug: "ilish", name: "ইলিশ মাছ", emoji: "🐟", category: "mach", categoryLabel: "মাছ", unit: "প্রতি কেজি", price: 1850, change: -2.9, description: "নদীর রুপালি স্বাদ, আকারভেদে দামের সামান্য পার্থক্য।", markets: [{ name: "যাত্রাবাড়ী মাছ বাজার", area: "ঢাকা", price: 1850, updated: "২০ মিনিট আগে" }, { name: "আগ্রাবাদ", area: "চট্টগ্রাম", price: 1920, updated: "৫৫ মিনিট আগে" }] },
  { id: 7, slug: "murgi", name: "ব্রয়লার মুরগি", emoji: "🍗", category: "mangsho", categoryLabel: "মাংস", unit: "প্রতি কেজি", price: 198, change: 1.7, description: "তাজা ব্রয়লার মুরগির গড় বাজারদর।", markets: [{ name: "মোহাম্মদপুর টাউন হল", area: "ঢাকা", price: 198, updated: "১৮ মিনিট আগে" }] },
  { id: 8, slug: "dim", name: "ফার্মের ডিম", emoji: "🥚", category: "dim", categoryLabel: "ডিম", unit: "প্রতি ডজন", price: 145, change: -0.8, description: "ফার্মের ডিম, এক ডজনের আজকের গড় দাম।", markets: [{ name: "উত্তরা রাজলক্ষ্মী", area: "ঢাকা", price: 145, updated: "২৭ মিনিট আগে" }] },
  { id: 9, slug: "roshun", name: "রসুন", emoji: "🧄", category: "moshla", categoryLabel: "মসলা", unit: "প্রতি কেজি", price: 230, change: 0, description: "দেশি রসুনের পরিচিত সুবাস ও স্বাদ।", markets: [{ name: "শ্যামবাজার", area: "ঢাকা", price: 230, updated: "১ ঘণ্টা আগে" }] },
  { id: 10, slug: "ada", name: "আদা", emoji: "🫚", category: "moshla", categoryLabel: "মসলা", unit: "প্রতি কেজি", price: 260, change: -1.1, description: "সতেজ আদা, রান্নাঘরের প্রতিদিনের সঙ্গী।", markets: [{ name: "মৌলভীবাজার", area: "সিলেট", price: 260, updated: "৪০ মিনিট আগে" }] },
];

export const categories = [
  { slug: "sobji", label: "সবজি", icon: "🥬" },
  { slug: "chal", label: "চাল", icon: "🍚" },
  { slug: "mach", label: "মাছ", icon: "🐟" },
  { slug: "mangsho", label: "মাংস", icon: "🍗" },
  { slug: "dim", label: "ডিম", icon: "🥚" },
  { slug: "moshla", label: "মসলা", icon: "🌶️" },
];

export const toBangla = (value: number | string) => String(value).replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
export const money = (value: number) => `${toBangla(value.toLocaleString("en-US"))} টাকা`;