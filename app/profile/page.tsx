"use client";
import Link from "next/link";
import { useState } from "react";
import { AuthGuard, Shell } from "../ui";
export default function Profile() { const [user] = useState(() => typeof window === "undefined" ? "ব্যবহারকারী" : localStorage.getItem("bazardor-user") || "ব্যবহারকারী"); return <Shell><AuthGuard><div className="profile-page"><span className="eyebrow">আমার অ্যাকাউন্ট</span><h1>প্রোফাইল</h1><div className="profile-card"><div className="avatar">✦</div><div><small>স্বাগতম</small><h2>{user}</h2><p>আপনার বাজারদর প্রোফাইল</p></div><Link className="outline-button" href="/profile/update">তথ্য আপডেট করুন <span>↗</span></Link></div></div></AuthGuard></Shell>; }