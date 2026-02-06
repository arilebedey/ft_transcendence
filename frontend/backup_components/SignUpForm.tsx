import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "../lib/auth-client";
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

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(50, { error: "Name must be at most 50 characters." }),
  email: z.email({ error: "Invalid email address." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(128, { error: "Password must be at most 128 characters." }),
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
      onSubmit: signUpSchema,
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="signup-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor={field.name}>
                    Name
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="John Doe"
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
          form="signup-form"
          className="w-full"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}
