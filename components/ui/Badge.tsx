import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "red" | "blue" | "gray";
  className?: string;
}

export function Badge({ children, variant = "gray", className }: BadgeProps) {
  const variants = {
    green: "bg-badge-green-bg text-badge-green-text",
    red: "bg-badge-red-bg text-badge-red-text",
    blue: "bg-[#DBEAFE] text-accent-blue", // Shared blue badge
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-[20px] text-[11px] font-semibold whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
