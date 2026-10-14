import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "frosted" | "outline" | "ghost" | "dark" | "ochre";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center rounded-full";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5 font-bold",
  };

  const variantStyles = {
    primary:
      "bg-[#823296] hover:bg-[#702882] text-white shadow-xs hover:shadow active:scale-[0.98]",
    secondary:
      "bg-[#1C0B27] hover:bg-[#261034] text-white shadow-xs hover:shadow active:scale-[0.98]",
    frosted:
      "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/25 active:scale-[0.98]",
    outline:
      "border border-charcoal-300 hover:border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900/5 active:scale-[0.98]",
    ghost:
      "text-charcoal-800 hover:bg-charcoal-900/5 hover:text-charcoal-950",
    dark:
      "bg-[#1A0B23] text-white hover:bg-[#2A1238] shadow-xs active:scale-[0.98]",
    ochre:
      "bg-[#FACC15] hover:bg-[#EAB308] text-[#1A0B23] shadow-xs active:scale-[0.98]",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
