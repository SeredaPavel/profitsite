// src/components/ui/Button.tsx
import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const styles: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:opacity-90 focus-visible:ring-foreground",
  outline:
    "border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 focus-visible:ring-foreground",
  ghost:
    "hover:bg-foreground/5 focus-visible:ring-foreground",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const cls = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
