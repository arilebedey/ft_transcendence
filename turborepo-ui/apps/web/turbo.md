#### .env

```env
API_URL=http://localhost:3000
```

#### middleware.ts

```ts
import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";
import { getCookieCache } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const sessionCookie = await getCookieCache(request);
    console.log(sessionCookie);

    if (!sessionCookie) {
      authClient.signIn.social({
        provider: "",
      });
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
}
```

#### next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

#### lib/auth-client.ts

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/api/auth",
});
```

#### components/SignUpForm.tsx

```tsx
"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function SignUpForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authClient.signUp.email({
        name,
        email,
        password,
      });
    } catch (err) {
      console.error("Sign up failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="text">
          Name
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="text"
            id="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="email">
          Email
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="email">
          Password
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button
        className="w-full mt-4 text-lg px-4 p-2 rounded-md bg-amber-500 disabled:opacity"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

#### components/LoginForm.tsx

```tsx
"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="email">
          Email
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label className="mt-3 block text-sm font-medium" htmlFor="email">
          Password
          <input
            className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
            type="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button
        className="w-full mt-4 text-lg px-4 p-2 rounded-md bg-amber-500 disabled:opacity"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
```

#### app/page.tsx

```tsx
"use client";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

export default function Home() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const [activeForm, setActiveForm] = useState<"login" | "signup">("signup");
  const [delayLoading, setDelayLoading] = useState<Boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setDelayLoading(true);
    } else {
      timer = setTimeout(() => {
        setDelayLoading(false);
      }, 110);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (delayLoading) {
    return (
      <div className="flex justify-center mt-10 items-center min-h-screen">
        <div className="rounded-xl bg-green-900 p-5">Loading 😊</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome</h1>
          <p className="text-gray-300">
            You are signed in as {session.user.email}
          </p>
          <button
            onClick={() => authClient.signOut()}
            className="mt-2 bg-red-900 px-4 py-2 rounded-md hover:bg-violet-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="items-center bg-red-950 p-1 rounded-lg">
          <button
            onClick={() => setActiveForm("login")}
            className={`px-4 py-2 rounded-md ${
              activeForm === "login" ? "shadow-sm bg-red-500" : "bg-red-950"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveForm("signup")}
            className={`px-4 py-2 rounded-md ${
              activeForm === "signup" ? "shadow-sm bg-red-500" : "bg-red-950"
            }`}
          >
            Sign Up
          </button>
        </div>
        <div className="h-8"></div>
        {activeForm === "login" ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
```

#### app/dashboard/page.tsx

```tsx
export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mt-8 bg-stone-800 p-6 rounded-md shadow-md">
        <h2 className="text-lg mb-4">Protected Content</h2>
        <p>This is a protected page</p>
      </div>
    </div>
  );
}
```

#### List of files provided

- .env
- middleware.ts
- next.config.js
- lib/auth-client.ts
- components/SignUpForm.tsx
- components/LoginForm.tsx
- app/page.tsx
- app/dashboard/page.tsx
