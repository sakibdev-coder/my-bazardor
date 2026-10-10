import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : (process.env.BETTER_AUTH_URL || "http://localhost:3000"),
});

export type UserSession = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

const USER_KEY = "bazardor-user";
const EMAIL_KEY = "bazardor-email";
const SESSION_KEY = "bazardor_session";

export function getClientSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const name = localStorage.getItem(USER_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  if (!name && !email) return null;
  return {
    id: email || "user-id",
    name: name || "ব্যবহারকারী",
    email: email || "user@bazardor.com",
  };
}

export function setClientSession(user: { name: string; email: string }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, user.name);
  localStorage.setItem(EMAIL_KEY, user.email);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  // Dispatch custom storage event for instant UI sync across components
  window.dispatchEvent(new Event("bazardor-auth-change"));
}

export function clearClientSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("bazardor-auth-change"));
}
