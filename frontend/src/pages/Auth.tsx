import React, { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";

export function Auth() {
  const [active, setActive] = useState<"login" | "signup">("signup");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{active === "login" ? "Sign in" : "Create account"}</h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${active === "signup" ? "bg-amber-500 text-white" : "border"}`}
              onClick={() => setActive("signup")}
            >
              Sign up
            </button>
            <button
              className={`px-3 py-1 rounded ${active === "login" ? "bg-amber-500 text-white" : "border"}`}
              onClick={() => setActive("login")}
            >
              Login
            </button>
          </div>
        </div>

        <div>
          {active === "login" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
}
