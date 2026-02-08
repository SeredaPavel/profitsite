// src/components/landing/ConsultationModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ConsultationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "sending">("idle");

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // По ТЗ: закрываем модалку при нажатии "Отправить заявку"
    // (даже если поля пустые).
    onClose();

    setStatus("sending");

    // Пока что без API: просто имитируем отправку.
    await new Promise((r) => setTimeout(r, 500));

    if (!name.trim() || !contact.trim()) {
      setStatus("err");
      return;
    }

    setStatus("ok");
    setName("");
    setContact("");
    setTask("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay: клик закрывает */}
      <div
        className="absolute inset-0 bg-black/40"
        onMouseDown={onClose}
        onTouchStart={onClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          className="relative w-full max-w-xl rounded-3xl border border-foreground/12 bg-background p-6 shadow-2xl"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* close */}
          <button
            aria-label="Закрыть"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 transition hover:bg-foreground hover:text-background"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="pr-12">
            <div className="text-sm font-semibold">Получить консультацию</div>
            <p className="mt-2 text-sm text-foreground/70">
              Оставьте контакт — мы уточним задачу и предложим решение.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <label className="grid gap-2">
              <span className="text-xs text-foreground/70">Имя</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border border-foreground/15 bg-background px-4 text-sm outline-none focus:border-foreground/35"
                placeholder="Как к вам обращаться?"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs text-foreground/70">Контакт (телефон / Telegram)</span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="h-11 rounded-xl border border-foreground/15 bg-background px-4 text-sm outline-none focus:border-foreground/35"
                placeholder="+7... или @username"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs text-foreground/70">Задача (кратко)</span>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="min-h-27.5 rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-foreground/35"
                placeholder="Например: лендинг под услугу, интеграция CRM, ускорение сайта…"
              />
            </label>

            <Button type="submit" variant="primary" className="w-full">
              {status === "sending" ? "Отправляем..." : "Отправить заявку"}
            </Button>

            {/* Статусы остаются (на будущее), но модалка закрывается сразу по клику */}
            {status === "ok" && (
              <div className="text-sm text-foreground/75">
                ✅ Заявка принята. Мы свяжемся с вами.
              </div>
            )}
            {status === "err" && (
              <div className="text-sm text-foreground/75">
                ⚠️ Укажите имя и контакт.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
