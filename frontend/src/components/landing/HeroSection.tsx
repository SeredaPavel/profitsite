// src/components/landing/HeroSection.tsx
"use client";

import { useRef } from "react";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const SERVICES: Array<{ title: string; desc: string; icon: React.ReactNode }> = [
  {
    title: "Разработка сайтов",
    desc: "Собираем структуру, дизайн и реализацию под бизнес-цели.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M4 6h16v12H4V6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M7 9h6M7 12h10M7 15h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Сопровождение и поддержка",
    desc: "Поддерживаем, обновляем, фиксируем, развиваем без хаоса.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M12 2a7 7 0 0 0-7 7v3a4 4 0 0 0 4 4h1v-2H9a2 2 0 0 1-2-2V9a5 5 0 0 1 10 0v3a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V9a7 7 0 0 0-7-7Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M10 20h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Оптимизация и скорость",
    desc: "Ускоряем загрузку, улучшаем UX и конверсию.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M12 3a9 9 0 1 0 9 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 12l6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 12a2 2 0 1 0 0.001 0Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Внедрение AI",
    desc: "Автоматизация, ассистенты, обработка данных там, где есть эффект.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M9 3v3M15 3v3M7 7h10M6 10v4a6 6 0 0 0 12 0v-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M9.5 13h.01M14.5 13h.01"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "UX/UI дизайн и проектирование",
    desc: "Проектируем сценарии, прототипы и визуал под аудиторию.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M4 4h8v8H4V4Zm10 0h6v6h-6V4ZM14 12h6v8h-6v-8ZM4 14h8v6H4v-6Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    title: "Веб-интеграции",
    desc: "Подключаем сервисы, API, платежи, телефонию, склад и т.п.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M7 7h4v4H7V7Zm6 6h4v4h-4v-4Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M11 9h2a4 4 0 0 1 4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13 15h-2a4 4 0 0 1-4-4V9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "CRM",
    desc: "Настраиваем воронки, заявки, статусы, интеграции и автоматизацию.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M3 20a4 4 0 0 1 8 0M13 20a4 4 0 0 1 8 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Аналитика",
    desc: "События, цели, метрики, отчеты — чтобы управлять ростом.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M5 19V9M10 19V5M15 19v-7M20 19v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

function ServicesSlider() {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.clientX;
    startLeft.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !dragging.current) return;
    const dx = e.clientX - startX.current;
    el.scrollLeft = startLeft.current - dx;
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className="mt-8">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {SERVICES.map((s) => (
          <article
            key={s.title}
            className={[
              "relative snap-start select-none",
              "min-w-[320px] sm:min-w-[420px] lg:min-w-[520px]",
              "rounded-3xl border border-foreground/10 bg-foreground/5",
              "p-6 sm:p-8",
              "transition",
              "group",
            ].join(" ")}
          >
            {/* верхний левый значок */}
            <div className="text-foreground/80">{s.icon}</div>

            {/* текст (как у тебя сейчас) */}
            <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {s.title}
            </h3>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/75 max-w-[42ch]">
              {s.desc}
            </p>

            {/* “акцент” как на видео: тёмная часть + дуга + стрелка */}
            <div
              className={[
                "pointer-events-none absolute inset-0 overflow-hidden rounded-3xl",
                "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                "transition-opacity duration-300",
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-foreground" />
              {/* дуга/полукруг */}
              <div className="absolute -right-[280px] -top-[160px] h-[520px] w-[520px] rounded-full bg-background" />
              {/* стрелка */}
              <div className="absolute right-6 top-6 text-background">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                  <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* дублируем заголовок/описание поверх акцента (чтобы читалось на тёмном) */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl p-6 sm:p-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
              <div className="text-background/80">{s.icon}</div>
              <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-background">
                {s.title}
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-background/80 max-w-[42ch]">
                {s.desc}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="text-xs text-foreground/55">
        Подсказка: можно листать колесом/тачпадом или “тянуть” мышкой.
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-foreground/10">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-[420px] w-[420px] rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <Container>
        <div className="relative py-14 sm:py-20">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <Badge>ProfitSite.ru</Badge>
              <Badge>Сайты • AI • CRM • Аналитика</Badge>
              <Badge>Под ключ</Badge>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Разрабатываем сайты и развиваем сервисы, которые приносят результат бизнесу
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
              От идеи и дизайна до AI, CRM и аналитики — под ключ. Делаем не шаблоны, а решения под ваши задачи.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#next-step" variant="primary">
                Получить консультацию
              </Button>
              <Button href="#next-step" variant="outline">
                Обсудить проект
              </Button>
              <Button href="tel:+79999999999" variant="ghost">
                Позвонить
              </Button>
            </div>

            {/* УСЛУГИ — форма как на фото + подвижность как на видео */}
            <ServicesSlider />
          </div>
        </div>
      </Container>
    </section>
  );
}
