import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "bazardor-secret-key-32-chars-long-min-2026",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-demo",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-demo",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "github-client-id-demo",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "github-client-secret-demo",
    },
  },
});
