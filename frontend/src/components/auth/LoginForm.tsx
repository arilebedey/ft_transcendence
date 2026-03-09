import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

const DEV_USERS = [
  {
    name: "Professor Wobblebottom",
    email: "professor.wobblebottom@example.com",
    password: "WobbleBottom!42",
  },
  {
    name: "Captain Turnip Deluxe",
    email: "captain.turnip.deluxe@example.com",
    password: "TurnipDeluxe!42",
  },
  {
    name: "DJ Sardine Eclipse",
    email: "dj.sardine.eclipse@example.com",
    password: "SardineEclipse!42",
  },
] as const;

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [activeDevEmail, setActiveDevEmail] = useState<string | null>(null);
  const isDev = import.meta.env.DEV;

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    listeners: {
      onChange: () => {
        setSubmitError("");
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");

      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onRequest: () => {
            setSubmitError("");
          },
          onSuccess: () => {
            navigate("/home");
          },
          onError: (ctx) => {
            setSubmitError(ctx.error.message || "Invalid email or password");
          },
        },
      );
    },
  });

  const handleDevAuth = async (devUser: (typeof DEV_USERS)[number]) => {
    setSubmitError("");
    setActiveDevEmail(devUser.email);
    try {
      const signUpResult = await authClient.signUp.email({
        name: devUser.name,
        email: devUser.email,
        password: devUser.password,
      });

      if (!signUpResult.error) {
        navigate("/home");
        return;
      }

      const signInResult = await authClient.signIn.email({
        email: devUser.email,
        password: devUser.password,
      });

      if (!signInResult.error) {
        navigate("/home");
        return;
      }

      setSubmitError(signInResult.error.message || "Dev login failed");
    } catch (err) {
      console.error("Dev auth failed:", err);
      setSubmitError("Dev login failed");
    } finally {
      setActiveDevEmail(null);
    }
  };

  return (
    <form
      className="space-y-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        children={(field) => {
          const errors = field.state.meta.errors;
          const isInvalid = errors.length > 0;

          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                placeholder={t("emailPlaceholder")}
                aria-invalid={isInvalid}
              />
              {isInvalid && (
                <p className="text-sm text-destructive">
                  {typeof errors[0] === "string"
                    ? errors[0]
                    : (errors[0] as any)?.message}
                </p>
              )}
            </div>
          );
        }}
      />

      <form.Field
        name="password"
        children={(field) => {
          const errors = field.state.meta.errors;
          const isInvalid = errors.length > 0;

          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t("Password")}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                placeholder="••••••••"
                aria-invalid={isInvalid}
              />
              {isInvalid && (
                <p className="text-sm text-destructive">
                  {typeof errors[0] === "string"
                    ? errors[0]
                    : (errors[0] as any)?.message}
                </p>
              )}
            </div>
          );
        }}
      />

      {submitError && (
        <div className="p-2 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
          {submitError}
        </div>
      )}

      <Button
        className="w-full mt-4"
        type="submit"
        disabled={form.state.isSubmitting || activeDevEmail !== null}
      >
        {form.state.isSubmitting ? "Signing In..." : t("signIn")}
      </Button>

      {isDev && (
        <div className="space-y-2 pt-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Dev users
          </p>
          <div className="grid gap-2">
            {DEV_USERS.map((devUser) => {
              const isLoading = activeDevEmail === devUser.email;

              return (
                <Button
                  key={devUser.email}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleDevAuth(devUser)}
                  type="button"
                  disabled={form.state.isSubmitting || activeDevEmail !== null}
                >
                  {isLoading ? "Authenticating..." : `[DEV] ${devUser.name}`}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
}
