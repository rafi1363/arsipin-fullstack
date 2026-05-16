import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors";

  const styles =
    variant === "primary"
      ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
      : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-strong)]";

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
