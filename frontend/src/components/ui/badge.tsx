import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {children}
    </span>
  );
}
