// src/components/ui/Badge.tsx
import { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
