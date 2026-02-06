// src/components/landing/NextStepSection.tsx
"use client";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

const TG_BOT_LINK = "https://t.me/ProfitSiteruBot";
const PHONE = "+79999999999";

export default function NextStepSection() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "sending">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // Пока что без API: просто показываем успех.
    // Следующим шагом подключим backend /api/lead -> Telegram.
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

  return (
    <section id="next-step">
      <Container>
        <div className="py-14 sm:py-20">
          <div className="rounded-3xl border border-foreground/12 bg-foreground/3 p-6 sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Что делать дальше?</h2>
            <p className="mt-3 max-w-2xl text-foreground/70">
              Опишите задачу — мы предложим оптимальное решение.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <form onSubmit={onSubmit} className="rounded-2xl border border-foreground/12 bg-background p-6">
                <div className="text-sm font-semibold">Получить консультацию</div>

                <div className="mt-4 grid grid-cols-1 gap-3">
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
                </div>
              </form>

              <div className="rounded-2xl border border-foreground/12 bg-background p-6">
                <div className="text-sm font-semibold">Альтернативный CTA</div>
                <div className="mt-4 grid gap-3">
                  <Button href={TG_BOT_LINK} variant="outline" className="w-full">
                    Обсудить проект (Telegram бот)
                  </Button>
                  <Button href={`tel:${PHONE}`} variant="outline" className="w-full">
                    Позвонить
                  </Button>

                  <div className="mt-4 rounded-xl bg-foreground/5 p-4 text-sm text-foreground/75">
                    Мы работаем спокойно и прозрачно: фиксируем этапы, держим связь,
                    двигаемся к измеримому результату.
                  </div>

                  <div className="text-xs text-foreground/60">
                    Телефон: {PHONE} • Telegram: @ProfitSiteruBot
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-foreground/60">
              Следующий шаг: подключим реальную отправку формы в Telegram через backend (FastAPI).
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
