import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "বাজার দর | BazarDor",
    template: "%s | বাজার দর",
  },
  description: "বাংলাদেশের প্রয়োজনীয় পণ্যের আজকের বাজারদর, পরিবর্তন ও বাজারভিত্তিক তথ্য এক নজরে।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn"><body>{children}</body></html>
  );
}
