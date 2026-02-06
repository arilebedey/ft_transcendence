import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import FormField from "./FormField";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authClient.signIn.email({
        email,
        password,
      });
    } catch (err) {
      console.error("Sign in failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
      <FormField label="Email" id="email" type="email" value={email} required onChange={setEmail} />
      <FormField label="Password" id="password" type="password" value={password} required onChange={setPassword} />
      <button
        className="w-full mt-4 text-lg px-4 p-2 rounded-md bg-amber-500 disabled:opacity-50"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
