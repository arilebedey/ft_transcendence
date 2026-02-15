import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface AuthProps {
  className?: string;
  cardClassName?: string;
}

export const Auth = ({ className = "flex items-center justify-center w-full", cardClassName = "w-full max-w-md" }: AuthProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<"login" | "signup">("signup");
  const navigate = useNavigate();
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;

  if (session) {
    navigate("/");
    return null;
  }

  return (
    <div className={className}>
      <Card className={cardClassName}>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="pb-4">
            {active === "login" ? t("signIn") : t("createAccount")}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={active === "signup" ? "default" : "outline"}
              size="sm"
              onClick={() => setActive("signup")}
            >
              {t("signUp")}
            </Button>
            <Button
              variant={active === "login" ? "default" : "outline"}
              size="sm"
              onClick={() => setActive("login")}
            >
              {t("login")}
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
