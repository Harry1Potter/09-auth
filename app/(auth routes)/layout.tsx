"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const didRefresh = useRef(false);
  const { clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!didRefresh.current) {
      didRefresh.current = true;
      clearIsAuthenticated();
      router.refresh();
    }
  }, [clearIsAuthenticated, router]);

  return <>{children}</>;
}