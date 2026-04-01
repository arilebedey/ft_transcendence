import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { checkUsernameAvailable } from "@/lib/profile-api";
import { DesktopModal } from "@/components/ui/DesktopModal";
import { MobileModal } from "@/components/ui/MobileModal";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import { LegalContent } from "@/pages/Legal";

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
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms.",
    }),
  })
  .refine((data) => data.password === data.password_verification, {
    message: "Password doesn't match",
    path: ["password_verification"],
  });

export default function SignUpForm() {
  const { t } = useTranslation();
  const isMobile = useIsMobileViewport(700);
  const [submitError, setSubmitError] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeLegalModal = () => setShowLegalModal(false);
  const ignoreDesktopOverlayClose = () => undefined;

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_verification: "",
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

            const handleNameChange = (value: string) => {
              field.handleChange(value);
              setUsernameTaken(false);
              setSubmitError("");
              const trimmed = value.trim().toLowerCase();
              if (trimmed.length < 3) {
                setUsernameChecking(false);
                return;
              }
              setUsernameChecking(true);
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(async () => {
                const { available } = await checkUsernameAvailable(trimmed);
                setUsernameTaken(!available);
                setUsernameChecking(false);
              }, 400);
            };

            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t("Name")}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t("Fullname")}
                  aria-invalid={isInvalid}
                />
                {usernameChecking && (
                  <p className="text-sm text-muted-foreground">
                    {t("checkingUsername")}
                  </p>
                )}
                {!usernameChecking && usernameTaken && (
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

        <form.Field
          name="password_verification"
          children={(field) => {
            const errors = field.state.meta.errors;
            const isInvalid = errors.length > 0;

            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t("Confirm password")}</Label>
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
              <div className="space-y-2">
                <div className="mt-2 flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  <div className="text-sm">
                    <label htmlFor={field.name}>{t("iAccept")} </label>
                    <button
                      type="button"
                      onClick={() => setShowLegalModal(true)}
                      className="underline text-blue-600 hover:text-blue-800"
                    >
                      {t("legal.modalTitle")}
                    </button>
                  </div>
                </div>
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
          disabled={
            form.state.isSubmitting || usernameChecking || usernameTaken
          }
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
              callbackURL: "http://localhost:5173/home",
            })
          }
        >
          {t("ContinueWithGoogle")}
        </Button>
      </form>

      {showLegalModal ? (
        isMobile ? (
          <MobileModal
            onClose={closeLegalModal}
            title={t("legal.modalTitle")}
            body={
              <div className="min-h-0 flex-1 overflow-y-auto">
                <LegalContent />
              </div>
            }
          />
        ) : (
          <DesktopModal
            onClose={ignoreDesktopOverlayClose}
            overlayClassName="bg-black/20"
            panelClassName="max-h-[min(42rem,calc(100vh-2rem))] w-[min(48rem,calc(100vw-2rem))]"
            body={
              <div className="flex min-h-0 h-full flex-col bg-card">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <LegalContent />
                </div>
                <div className="border-t px-6 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeLegalModal}
                  >
                    {t("back")}
                  </Button>
                </div>
              </div>
            }
          />
        )
      ) : null}
    </>
  );
}
