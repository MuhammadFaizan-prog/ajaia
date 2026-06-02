import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, initials, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden bg-slate-200 text-slate-600 font-medium shrink-0",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
      ) : initials ? (
        initials
      ) : (
        <User className="w-1/2 h-1/2" />
      )}
    </div>
  );
}
