// src/components/ui/Container.tsx
import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        mx-auto w-full
        max-w-6xl
        px-4 sm:px-6 lg:px-8
        2xl:max-w-[1600px]
      "
    >
      {children}
    </div>
  );
}
