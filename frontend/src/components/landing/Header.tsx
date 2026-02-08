// frontend/src/components/landing/Header.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type NavItem = {
  label: string;
  id: string;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const nav = useMemo<NavItem[]>(
    () => [
      { label: "Услуги", id: "services" },
      { label: "Цены", id: "pricing" },
      { label: "Кейсы", id: "cases" },
      { label: "Решения", id: "solutions" },
      { label: "Контакты", id: "contacts" },
      { label: "Система", id: "system" },
    ],
    []
  );

  function focusSection(el: HTMLElement) {
    el.classList.add("scroll-focus");
    window.setTimeout(() => el.classList.remove("scroll-focus"), 900);
  }

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    focusSection(el);
  }

  function handleNavClick(id: string) {
    setOpen(false);
    // чуть подождём закрытия меню, чтобы скролл не дёргался на мобилке
    window.setTimeout(() => scrollToId(id), 50);
  }

  // Закрытие по клику/тапу вне панели (и по любому тапу по оверлею)
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (panelRef.current && panelRef.current.contains(t)) return;
      setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Лого/название */}
          <div className="text-sm font-extrabold tracking-tight">
            ProfitSite
          </div>

          {/* Десктоп-нав */}
          <nav className="hidden items-center gap-2 md:flex">
            {nav.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="px-4 py-2 text-xs"
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Бургер (мобилка) */}
          <div className="md:hidden">
            <button
              aria-label="Открыть меню"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 transition hover:bg-foreground hover:text-background"
              onClick={() => setOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Мобильное меню */}
      {open && (
        <div className="md:hidden">
          {/* Оверлей — тап в любое место закрывает */}
          <div className="fixed inset-0 z-40 bg-black/20" />

          <div className="fixed left-0 right-0 top-[60px] z-50 px-4">
            <div
              ref={panelRef}
              className="rounded-3xl border border-foreground/12 bg-background p-3 shadow-lg"
            >
              <div className="grid grid-cols-1 gap-2">
                {nav.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="w-full px-4 py-3 text-sm"
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
