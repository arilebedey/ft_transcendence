import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function AuthSection() {
  const sessionResult = authClient.useSession();
  const [delayLoading, setDelayLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<"login" | "signup">("signup");

  const session = sessionResult?.data;
  const isPending = sessionResult?.isPending ?? false;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPending) {
      setDelayLoading(true);
    } else {
      timer = setTimeout(() => {
        setDelayLoading(false);
      }, 110);
    }
    return () => clearTimeout(timer);
  }, [isPending]);

  if (delayLoading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <div className="rounded-xl bg-muted text-muted-foreground p-5">
          Loading...
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              You are signed in as {session.user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => authClient.signOut()}>Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center flex-1 px-4">
      <div className="inline-flex items-center gap-1 rounded-lg border bg-card p-1 mb-8">
        <button
          onClick={() => setActiveForm("login")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeForm === "login"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveForm("signup")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeForm === "signup"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
      </div>
      {activeForm === "login" ? <LoginForm /> : <SignUpForm />}
    </div>
  );
}
