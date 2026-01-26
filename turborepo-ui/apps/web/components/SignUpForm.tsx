"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function SignUpForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authClient.signUp.email({
        name,
        email,
        password,
      });
    } catch (err) {
      console.error("Sign up failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="text">
          Name
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="text"
            id="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="email">
          Email
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="email">
          Password
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button
        className="w-full mt-4 text-lg px-4 p-2 rounded-md bg-amber-500 disabled:opacity"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
