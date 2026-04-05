import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { checkUsernameAvailable } from "@/lib/profile-api";
import { LegalAgreement } from "@/components/auth/LegalAgreement";

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters.")
      .max(12, "Name must be at most 12 characters.")
      .regex(
        /^[a-z0-9][a-z0-9_]*$/,
        "Lowercase letters, numbers, and underscores only (no uppercase or special characters)",
      )
      .refine(
        (name) => !name.startsWith("_"),
        "Name cannot start with an underscore",
      )
      .transform((name) => name.toLowerCase()),
    email: z.string("Invalid email address."),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters.")
      .regex(/[A-Z]/, "Must contain one uppercase")
      .regex(/[0-9]/, "Must contain one number")
      .regex(/[^a-zA-Z0-9]/, "Must contain one special character"),
    password_verification: z.string(),
  })
  .refine((data) => data.password === data.password_verification, {
    message: "Password doesn't match",
    path: ["password_verification"],
  });

function getSocialCallbackUrl() {
  return `${window.location.origin}/home`;
}

export default function SignUpForm() {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_verification: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    listeners: {
      onChange: () => {
        setSubmitError("");
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");

      const { available } = await checkUsernameAvailable(
        value.name.trim().toLowerCase(),
      );
      if (!available) {
        setUsernameTaken(true);
        return;
      }

      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (!error) return;

      if (error.code == "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL")
        setSubmitError("Email already in use.");
      else if (error) setSubmitError("Sign up failed");
    },
  });

  return (
    <>
      <form
        className="space-y-4 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => {
            const errors = field.state.meta.errors;
            const isInvalid = errors.length > 0 || usernameTaken;

            return (
              <div className="space-y-2">
                <Label>{t("Name")}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setUsernameTaken(false);
                    setSubmitError("");
                  }}
                  placeholder={t("Fullname")}
                />
                {usernameTaken && (
                  <p className="text-sm text-destructive">
                    {t("usernameTaken")}
                  </p>
                )}
                {isInvalid && errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {typeof errors[0] === "string"
                      ? errors[0]
                      : errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        />

        <form.Field
          name="email"
          children={(field) => {
            const errors = field.state.meta.errors;
            const isInvalid = errors.length > 0;

            return (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                />
                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {typeof errors[0] === "string"
                      ? errors[0]
                      : errors[0]?.message}
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
                <Label>{t("Password")}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                />
                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {typeof errors[0] === "string"
                      ? errors[0]
                      : errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        />

        <form.Field
          name="password_verification"
          children={(field) => {
            const errors = field.state.meta.errors;
            const isInvalid = errors.length > 0;

            return (
              <div className="space-y-2">
                <Label>{t("Confirm password")}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                  placeholder="••••••••"
                />
                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {typeof errors[0] === "string"
                      ? errors[0]
                      : errors[0]?.message}
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

        <LegalAgreement />

        <Button
          className="w-full mt-4"
          type="submit"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? "Creating account..." : t("signUp")}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              callbackURL: getSocialCallbackUrl(),
            })
          }
        >
          {t("ContinueWithGoogle")}
        </Button>
      </form>
    </>
  );
}
