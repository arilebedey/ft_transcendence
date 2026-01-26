"use client";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

export default function Home() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const [activeForm, setActiveForm] = useState<"login" | "signup">("signup");
  const [delayLoading, setDelayLoading] = useState<Boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setDelayLoading(true);
    } else {
      timer = setTimeout(() => {
        setDelayLoading(false);
      }, 110);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (delayLoading) {
    return (
      <div className="flex justify-center mt-10 items-center min-h-screen">
        <div className="rounded-xl bg-green-900 p-5">Loading 😊</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome</h1>
          <p className="text-gray-300">
            You are signed in as {session.user.email}
          </p>
          <button
            onClick={() => authClient.signOut()}
            className="mt-2 bg-red-900 px-4 py-2 rounded-md hover:bg-violet-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="items-center bg-red-950 p-1 rounded-lg">
          <button
            onClick={() => setActiveForm("login")}
            className={`px-4 py-2 rounded-md ${
              activeForm === "login" ? "shadow-sm bg-red-500" : "bg-red-950"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveForm("signup")}
            className={`px-4 py-2 rounded-md ${
              activeForm === "signup" ? "shadow-sm bg-red-500" : "bg-red-950"
            }`}
          >
            Sign Up
          </button>
        </div>
        <div className="h-8"></div>
        {activeForm === "login" ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
