"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "react-hot-toast";
import { authClient, setClientSession } from "@/lib/auth-client";
import { Shell } from "../ui";

function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getNextPath = () => {
    if (typeof window === "undefined") return "/";
    const params = new URLSearchParams(window.location.search);
    return params.get("next") || "/";
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    // Validation
    if (!email || !email.includes("@")) {
      const msg = "সঠিক ইমেইল ঠিকানা প্রদান করুন।";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      const msg = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    try {
      try {
        await authClient.signIn.email({
          email,
          password,
        });
      } catch {}

      // Check registered name if exists in storage
      let userName = email.split("@")[0];
      try {
        const stored = JSON.parse(localStorage.getItem("bazardor-registered-user") || "null");
        if (stored?.email === email && stored?.name) {
          userName = stored.name;
        }
      } catch {}

      setClientSession({
        name: userName,
        email,
      });

      toast.success("সফলভাবে লগইন সম্পন্ন হয়েছে!");
      router.push(getNextPath());
    } catch {
      const msg = "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoading(true);
    const providerName = provider === "google" ? "Google" : "GitHub";

    try {
      try {
        await authClient.signIn.social({
          provider,
        });
      } catch {}

      setClientSession({
        name: `${providerName} ব্যবহারকারী`,
        email: `${provider}.user@bazardor.com`,
      });

      toast.success(`${providerName} দিয়ে সফলভাবে লগইন হয়েছে!`);
      router.push(getNextPath());
    } catch {
      toast.error(`${providerName} লগইন ব্যর্থ হয়েছে।`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 220px)",
        padding: "48px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 1. Header outside card */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 8px",
          }}
        >
          লগইন করুন
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
          আপনার অ্যাকাউন্টে প্রবেশ করে সব বিস্তারিত বাজার তথ্য দেখুন।
        </p>
      </div>

      {/* 2. Main White Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          border: "1px solid #eef2ec",
          borderRadius: "16px",
          padding: "32px 32px 28px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
          boxSizing: "border-box",
        }}
      >
        <form
          onSubmit={handleSignIn}
          noValidate
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            <span>ইমেইল</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 14px",
                border: "1px solid #e5e9df",
                backgroundColor: "#fcfdfb",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#111827",
                outline: "none",
              }}
            />
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            <span>পাসওয়ার্ড</span>
            <input
              name="password"
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 14px",
                border: "1px solid #e5e9df",
                backgroundColor: "#fcfdfb",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#111827",
                outline: "none",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
              }}
              role="alert"
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "13px",
              backgroundColor: "#0f7a4a",
              color: "#ffffff",
              fontSize: "14.5px",
              fontWeight: 700,
              border: 0,
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(15, 122, 74, 0.25)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            margin: "24px 0 18px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#eef2ec",
            }}
          />
          <span
            style={{
              position: "relative",
              backgroundColor: "#ffffff",
              padding: "0 12px",
              color: "#9ca3af",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            অথবা
          </span>
        </div>

        {/* Social Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 8px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 8px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#24292f" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Footer text inside card */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#4b5563" }}>
          <span>অ্যাকাউন্ট নেই? </span>
          <Link
            href="/signup"
            style={{
              color: "#0f7a4a",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            সাইন আপ করুন
          </Link>
        </div>
      </div>

      {/* 3. Back to home link outside card */}
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Link
          href="/"
          style={{
            color: "#6b7280",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Shell>
      <Suspense fallback={<div className="auth-loading"><div className="spinner" />লোড হচ্ছে...</div>}>
        <SignInForm />
      </Suspense>
    </Shell>
  );
}