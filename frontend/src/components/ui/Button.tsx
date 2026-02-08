// src/components/ui/Button.tsx
import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const styles: Record<Variant, string> = {
  primary:
    [
      "bg-foreground text-background",
      "border border-transparent",
      // инверсия при hover (как ты просил)
      "hover:bg-background hover:text-foreground hover:border-foreground/30",
      "focus-visible:ring-foreground",
    ].join(" "),
  outline:
    [
      "border border-foreground/30",
      // инверсия при hover
      "hover:bg-foreground hover:text-background hover:border-foreground",
      "focus-visible:ring-foreground",
    ].join(" "),
  ghost:
    [
      "border border-foreground/30",
      "hover:bg-foreground hover:text-background hover:border-foreground",
      "focus-visible:ring-foreground",
    ].join(" "),
};

function isExternalHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:")
  );
}

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
    // Внешние ссылки (Telegram, tel, mail) — через <a>
    if (isExternalHref(href)) {
      const isHttp = href.startsWith("http://") || href.startsWith("https://");
      return (
        <a
          href={href}
          className={cls}
          target={isHttp ? "_blank" : undefined}
          rel={isHttp ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }

    // Внутренние ссылки и якоря — через next/link
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
