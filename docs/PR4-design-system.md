This is the doc for PR #4

## Components

Reusable components using HTML, Tailwind v4 and class-variance-authority (CVA - explained below)

## Important to understand added technologies / libraries / functions

## Zod

What is Zod? [Zod](https://zod.dev/)
How does it work? [Zod usage](https://zod.dev/basics)

See signUpSchema and loginSchema in LoginForm.tsx and SignUpForm.tsx

## Zustand

What is Zustand? How does it work? [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)

The Theme Store is located at `frontend/src/stores/theme-store.ts` (aka `@/stores/theme-store.ts` with the `@/` directive, added in this PR too). The file is annotated with explanations.

## Merge CSS Classes Properly

Is achieved by `cn()` at `frontend/src/lib/utils.ts`:

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Only used `button`, `input`, `card` for now.

### twMerge()

Tailwind classes follow a "last one wins" rule, causing conflicts when parent and child styles overlap (e.g., `p-2` vs `py-2`). tailwind-merge (`twMerge()`) resolves conflicts intelligently. It removes older classes when a new one modifies the same property (like `p-8` replacing `py-2`), while preserving distinct classes. This ensures styles override predictably without deleting non-conflicting utilities.

### `clsx`

`clsx` conditionally combines inputs.

"Conditionally combines" refers to the ability to handle inputs that might not be valid class strings or that should only appear based on specific logic.

It allows you to pass various data types—objects, arrays, booleans, or `null`—rather than just a string. `clsx` filters out falsy values (like `false`, `null`, or `undefined`) and flattens the result into a single string.

For example, you can pass an object where keys are class names and values are boolean conditions, or an array of mixed classes. `clsx` evaluates these conditions and includes only the classes that evaluate to `true`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isLoading, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

          // clsx object syntax for conditional logic
          {
            "bg-muted cursor-not-allowed animate-pulse": isLoading,
            "opacity-50 cursor-not-allowed": disabled || isLoading,
            "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive":
              props["aria-invalid"],
          },

          className,
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
```

---

## Component Variant System

Instead of prop spaghetti, use `class-variance-authority` (CVA) to manage component styles systematically.

Used in `frontend/src/components/ui/button.tsx`

**Without CVA (messy):**

```tsx
<Button
  size={size}
  variant={variant}
  className={`
    ${size === "lg" ? "h-11 px-8" : "h-10 px-4"}
    ${variant === "primary" ? "bg-blue text-white" : "bg-gray"}
  `}
/>
```

**With CVA (clean):**

```tsx
const buttonVariants = cva("inline-flex items-center rounded-md", {
  variants: {
    size: {
      default: "h-10 px-4",
      lg: "h-11 px-8",
    },
    variant: {
      default: "bg-primary text-white",
      outline: "border bg-white",
    },
  },
});

// Usage:
<Button size="lg" variant="outline" />;
```

**Benefits:**

- Type-safe variants
- Reusable across components
- Easy to maintain
- Single source of truth for styles

---

## `@radix-ui/react-slot` + `asChild` Pattern

Its so that we can use Button from our design system with other components like Link and a tag.

**Example: Button as a Link**

Without `Slot`:

```tsx
// Can't do this - Button only renders <button>
<Button href="/home">Home</Button> // href does nothing
```

With `Slot` + `asChild`:

```tsx
<Button asChild>
  <a href="/home">Home</a>
</Button>
// Renders: <a> with all Button styles + functionality
```

**How it works:**

```tsx
const Button = ({ asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button";

  return <Comp className={buttonStyles} {...props} />;
};
```

If `asChild=true`, use `Slot` which merges props with child element.
If `asChild=false`, render native `<button>`.

**Real use case:**

```tsx
// Button as link
<Button asChild>
  <Link to="/profile">View Profile</Link>
</Button>

// Button as form submit
<Button type="submit">Submit</Button>

// Button as router link
<Button asChild>
  <router.Link href="/settings" />
</Button>
```

**TL;DR:** One Button component, infinite flexibility. No wrapper divs needed.
