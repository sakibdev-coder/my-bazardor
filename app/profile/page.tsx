"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getClientSession, UserSession } from "@/lib/auth-client";
import { AuthGuard, Shell } from "../ui";

export default function Profile() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    queueMicrotask(() => setSession(getClientSession()));
  }, []);

  const userName = session?.name || "ব্যবহারকারী";
  const userEmail = session?.email || "user@bazardor.com";

  return (
    <Shell>
      <AuthGuard>
        <div className="profile-page">
          <div className="profile-header">
            <span className="eyebrow">আমার অ্যাকাউন্ট</span>
            <h1>ব্যবহারকারী প্রোফাইল</h1>
            <p>আপনার বাজারদর অ্যাকাউন্টের বিস্তারিত তথ্য ও সেটিংস</p>
          </div>

          <div className="profile-card">
            <div className="profile-card-left">
              <div className="avatar" aria-hidden="true">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-meta">
                <span className="user-role-badge">✓ ভেরিফাইড সদস্য</span>
                <h2 className="user-display-name">{userName}</h2>
                <p className="user-display-email">{userEmail}</p>
                <small className="user-join-info">অ্যাকাউন্ট স্ট্যাটাস: সক্রিয়</small>
              </div>
            </div>

            {/* Requirement C3: In My Profile route there will be an update button. On clicking it, Take user to another route */}
            <div className="profile-card-right">
              <Link
                className="primary-button update-btn"
                href="/profile/update"
                id="btn-update-profile-info"
              >
                তথ্য আপডেট করুন <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className="profile-extra-sections">
            <div className="profile-info-box">
              <h3>🔒 নিরাপত্তা ও গোপনীয়তা</h3>
              <p>আপনার তথ্য BetterAuth সুরক্ষা প্রোটোকল দ্বারা সম্পূর্ণ এনক্রিপ্টেড ও সুরক্ষিত।</p>
            </div>
            <div className="profile-info-box">
              <h3>📊 বাজারদর অগ্রাধিকার</h3>
              <p>আপনার পছন্দের খাদ্যদ্রব্যের দৈনিক মূল্য পরিবর্তনের নোটিফিকেশন চালু রয়েছে।</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    </Shell>
  );
}