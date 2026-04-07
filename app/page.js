// app/page.js
// Home Page — Renders Citizen Portal as the public landing page
// with a login button for admin access

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/citizen");
  }, [router]);

  return null;
}
