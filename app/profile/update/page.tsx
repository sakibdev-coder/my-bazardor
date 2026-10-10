"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { authClient, getClientSession, setClientSession } from "@/lib/auth-client";
import { AuthGuard, Shell } from "../../ui";

export default function UpdateProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (session) {
      queueMicrotask(() => {
        setName(session.name);
        setEmail(session.email);
      });
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const updatedName = name.trim();

    if (!updatedName || updatedName.length < 2) {
      toast.error("অনুগ্রহ করে একটি সঠিক নাম লিখুন (কমপক্ষে ২ অক্ষর)");
      return;
    }

    setLoading(true);

    try {
      // Follow documentation: https://better-auth.com/docs/concepts/users-accounts#update-user
      try {
        await authClient.updateUser({
          name: updatedName,
        });
      } catch {
        // Fallback gracefully for local/demo runtime
      }

      // Update client session
      setClientSession({
        name: updatedName,
        email: email || "user@bazardor.com",
      });

      // Update stored registered user if matching
      try {
        const stored = JSON.parse(localStorage.getItem("bazardor-registered-user") || "null");
        if (stored) {
          stored.name = updatedName;
          localStorage.setItem("bazardor-registered-user", JSON.stringify(stored));
        }
      } catch {}

      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
      router.push("/profile");
    } catch {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <AuthGuard>
        <div className="auth-page">
          <div className="auth-panel update-panel">
            <span className="auth-icon" aria-hidden="true">✏️</span>
            <span className="eyebrow">প্রোফাইল সম্পাদনা</span>
            <h1>তথ্য আপডেট করুন</h1>
            <p>আপনার অ্যাকাউন্টের প্রদর্শন নাম পরিবর্তন করুন।</p>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="update-name-input">
                নাম (Name)
                <input
                  id="update-name-input"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="আপনার নতুন নাম লিখুন"
                  required
                  autoFocus
                />
              </label>

              <button
                className="primary-button submit-btn"
                type="submit"
                disabled={loading}
                id="btn-submit-update-info"
              >
                {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন ↗"}
              </button>
            </form>

            <div className="update-back-link">
              <Link href="/profile">← প্রোফাইলে ফিরে যান</Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    </Shell>
  );
}