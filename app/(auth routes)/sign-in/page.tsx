"use client";

import css from "./SignInPage.module.css";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      router.push("/profile");
    },
    onError: () => {
      setError("Invalid email or password");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    mutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging in..." : "Log in"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

