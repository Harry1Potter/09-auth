"use client";

import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

export default function Header() {
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  return (
    <header className={css.header}>
      <nav>
        <ul className={css.navigation}>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}