import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none rounded-[8px]";

    const variants = {
      primary: "bg-accent-blue text-white hover:bg-blue-600",
      secondary: "bg-sidebar-active-bg text-accent-blue hover:bg-blue-100",
      outline: "border border-border bg-white text-text-primary hover:bg-slate-50",
      ghost: "bg-transparent text-text-secondary hover:bg-slate-100 hover:text-text-primary",
      danger: "bg-accent-red text-white hover:bg-red-600",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
