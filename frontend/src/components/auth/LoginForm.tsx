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
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const isDev = process.env.NODE_ENV === "development";

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
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

  const handleSkipAuth = async () => {
    const devCredentials = {
      email: "dev@example.com",
      password: "devpassword123",
      name: "Dev",
    };

    try {
      await authClient.signUp.email(devCredentials);
      navigate("/home");
    } catch {
      try {
        await authClient.signIn.email({
          email: devCredentials.email,
          password: devCredentials.password,
        });
        navigate("/home");
      } catch (err) {
        console.error("Dev login failed:", err);
      }
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
                  if (submitError) setSubmitError("");
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
                  if (submitError) setSubmitError("");
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
        disabled={form.state.isSubmitting}
      >
        {form.state.isSubmitting ? "Signing In..." : t("signIn")}
      </Button>

      {isDev && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs opacity-50"
          onClick={handleSkipAuth}
          type="button"
        >
          [DEV] Skip Authentication
        </Button>
      )}
    </form>
  );
}
