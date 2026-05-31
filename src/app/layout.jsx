"use client";

import { useEffect } from "react";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  useEffect(() => {
  const hostname = window.location.hostname;
  if (hostname.startsWith("dashboard") || hostname.startsWith("admin")) {
    // Build the redirect URL dynamically from the current window location
    // so it works on localhost, staging, and production without any env var
    const origin = `${window.location.protocol}//${
      // Strip the "admin." or "dashboard." subdomain to get the base domain
      hostname.replace(/^(admin|dashboard)\./, "")
    }${window.location.port ? `:${window.location.port}` : ""}`;
    window.location.href = `${origin}/admin/dashboard`;
  }
}, []); 
  return (
    <html lang="en">
      <body className="font-[var(--font-poppins)]">{children}</body>
    </html>
  );
}

