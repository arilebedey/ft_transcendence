import React, { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Auth() {
  const [active, setActive] = useState<"login" | "signup">("signup");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{active === "login" ? "Sign in" : "Create account"}</CardTitle>
          <div className="flex gap-2">
            <Button variant={active === "signup" ? "default" : "outline"} size="sm" onClick={() => setActive("signup")}>Sign up</Button>
            <Button variant={active === "login" ? "default" : "outline"} size="sm" onClick={() => setActive("login")}>Login</Button>
          </div>
        </CardHeader>
        <CardContent>
          {active === "login" ? <LoginForm /> : <SignUpForm />}
        </CardContent>
      </Card>
    </div>
  );
}
