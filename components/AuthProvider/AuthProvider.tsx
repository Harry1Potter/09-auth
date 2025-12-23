"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const privateRoutes = ["/profile"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await checkSession();

        if (!session) {
          clearIsAuthenticated();

          if (privateRoutes.some((route) => pathname.startsWith(route))) {
            router.replace("/sign-in");
          }

          return;
        }

        const user = await getMe();

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return children;
}
