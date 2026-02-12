import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SignUpForm() {
  const [submitError, setSubmitError] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");
      try {
        await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
        });
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Sign up failed");
      }
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
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Full name"
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
        {form.state.isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
