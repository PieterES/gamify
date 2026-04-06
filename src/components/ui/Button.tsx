import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-semibold rounded transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-bg disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-cyber-primary text-cyber-bg hover:bg-cyber-primary/90 focus:ring-cyber-primary": variant === "primary",
          "bg-cyber-surface border border-cyber-border text-cyber-text hover:border-cyber-primary/50": variant === "secondary",
          "bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger hover:bg-cyber-danger/30": variant === "danger",
          "text-cyber-muted hover:text-cyber-text hover:bg-cyber-surface": variant === "ghost",
          "bg-cyber-success/20 border border-cyber-success/50 text-cyber-success hover:bg-cyber-success/30": variant === "success",
        },
        {
          "text-xs px-2.5 py-1.5": size === "sm",
          "text-sm px-4 py-2": size === "md",
          "text-base px-6 py-3": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
