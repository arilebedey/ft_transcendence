import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TermsCheckbox from "./TermsCheckbox";
import { useTranslation } from "react-i18next";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms.",
  }),
});

export default function SignUpForm() {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
    validators: {
      onChange: signUpSchema,
    },
    listeners: {
      onChange: () => {
        setSubmitError("");
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");

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
          const isInvalid = errors.length > 0;

          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t("Name")}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t("Fullname")}
                aria-invalid={isInvalid}
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
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t("emailPlaceholder")}
                aria-invalid={isInvalid}
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
              <Label htmlFor={field.name}>{t("Password")}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="••••••••"
                aria-invalid={isInvalid}
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

      <form.Field
        name="termsAccepted"
        children={(field) => {
          const errors = field.state.meta.errors;
          return (
            <div>
              <TermsCheckbox
                value={field.state.value}
                onChange={(checked) => field.handleChange(checked)}
              />
              {errors.length > 0 && (
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

      <Button
        className="w-full mt-4"
        type="submit"
        disabled={form.state.isSubmitting}
      >
        {form.state.isSubmitting ? "Creating account..." : t("signUp")}
      </Button>
    </form>
  );
}
