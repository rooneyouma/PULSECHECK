"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /status now lives at the root /
// This redirect preserves any bookmarks pointing at /status
export default function StatusRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
