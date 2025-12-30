"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import css from "./AuthNavigation.module.css";

import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

export default function AuthNavigation() {
  const router = useRouter();

  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/" prefetch={false} className={css.navigationLink}>
          Home
        </Link>
      </li>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button
              type="button"
              className={css.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Register
            </Link>
          </li>
        </>
      )}
      <li className={css.navigationItem}>
        <Link
          href="/notes/filter/all"
          prefetch={false}
          className={css.navigationLink}
        >
          Notes
        </Link>
      </li>
    </>
  );
}
