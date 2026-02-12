import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function LoginForm() {
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    console.log("This doesn't log when I click on `login` button of Auth.tsx");
  }, []);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value);
      setSubmitError("");
      try {
        const result = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });
        console.log("Sign in result:", result);
      } catch (err) {
        console.error("Sign in error:", err);
        setSubmitError(err instanceof Error ? err.message : "Sign in failed");
      }
    },
  });

  return (
    <form
      className="space-y-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Form submit event triggered");
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
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="you@example.com"
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
              <Label htmlFor={field.name}>Password</Label>
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

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button
        className="w-full mt-4"
        type="submit"
        disabled={form.state.isSubmitting}
      >
        {form.state.isSubmitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
