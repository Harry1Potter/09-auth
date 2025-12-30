"use client";

import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

export default function Header() {
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

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
  }, [setUser, clearIsAuthenticated, isAuthenticated]);

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