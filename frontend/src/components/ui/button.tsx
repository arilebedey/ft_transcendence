import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
<<<<<<< HEAD
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // cva is documented in docs/ for PR #4
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
=======

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
>>>>>>> 6b6eef6 (Add front-end proposition. Working on plugging back-end)
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
<<<<<<< HEAD
        // add more variants as we go
=======
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
>>>>>>> 6b6eef6 (Add front-end proposition. Working on plugging back-end)
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
<<<<<<< HEAD
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
=======
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
>>>>>>> 6b6eef6 (Add front-end proposition. Working on plugging back-end)
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
<<<<<<< HEAD
    // 'asChild' allows the Button to merge its styles and behavior into a child element.
    // Instead of rendering a <button>, it renders the child (e.g., <a> or Link) with the button styles.
    // This is handled by the <Slot> component from @radix-ui/react-slot.
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
=======
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
>>>>>>> 6b6eef6 (Add front-end proposition. Working on plugging back-end)
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
