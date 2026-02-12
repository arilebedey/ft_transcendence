import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Auth = () => {
  const [active, setActive] = useState<"login" | "signup">("signup");
  const navigate = useNavigate();
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;

  if (session) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="pb-4">
            {active === "login" ? "Sign in" : "Create account"}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={active === "signup" ? "default" : "outline"}
              size="sm"
              onClick={() => setActive("signup")}
            >
              Sign up
            </Button>
            <Button
              variant={active === "login" ? "default" : "outline"}
              size="sm"
              onClick={() => setActive("login")}
            >
              Login
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {active === "login" ? <LoginForm /> : <SignUpForm />}
        </CardContent>
      </Card>
    </div>
  );
};
