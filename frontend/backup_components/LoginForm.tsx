import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "../lib/auth-client";
<<<<<<< HEAD
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const loginSchema = z.object({
  email: z.email({ error: "Invalid email address." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." }),
});
=======
import FormField from "./FormField";
>>>>>>> 973cbee (Working on reusable components && general graphic identity)

export default function LoginForm() {
  const [submitError, setSubmitError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");
      try {
        await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Sign in failed");
      }
    },
  });

  return (
<<<<<<< HEAD
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor={field.name}>
                    Email
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="you@example.com"
                  />
                  {isInvalid && field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor={field.name}>
                    Password
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="••••••••"
                  />
                  {isInvalid && field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </CardFooter>
    </Card>
=======
    <form className="space-y-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
      <FormField
        label="Email"
        id="email"
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormField
        label="Password"
        id="password"
        type="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full mt-4 text-lg px-4 p-2 rounded-md bg-amber-500 disabled:opacity-50"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
>>>>>>> 973cbee (Working on reusable components && general graphic identity)
  );
}
