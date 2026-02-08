// src/components/landing/HeroSection.tsx
"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import ConsultationModal from "@/components/landing/ConsultationModal";

const TG_BOT_LINK = "https://t.me/ProfitSiteruBot";
const PHONE = "+79999999999";
const SERVICES = [
  {
    title: "Разработка сайтов",
    desc: "Собираем структуру, дизайн и реализацию под бизнес-цели.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
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
        <path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 12a2 2 0 1 0 0.001 0Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Внедрение AI",
    desc: "Автоматизация, ассистенты, обработка данных там, где есть эффект.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M9 3v3M15 3v3M7 7h10M6 10v4a6 6 0 0 0 12 0v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9.5 13h.01M14.5 13h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "UX/UI дизайн и проектирование",
    desc: "Проектируем сценарии, прототипы и визуал под аудиторию.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M4 4h8v8H4V4Zm10 0h6v6h-6V4ZM14 12h6v8h-6v-8ZM4 14h8v6H4v-6Z" fill="currentColor" opacity="0.9" />
      </svg>
    ),
  },
  {
    title: "Веб-интеграции",
    desc: "Подключаем сервисы, API, платежи, телефонию, склад и т.п.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M7 7h4v4H7V7Zm6 6h4v4h-4v-4Z" fill="currentColor" opacity="0.9" />
        <path d="M11 9h2a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 15h-2a4 4 0 0 1-4-4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "CRM",
    desc: "Настраиваем воронки, заявки, статусы, интеграции и автоматизацию.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor" opacity="0.9" />
        <path d="M3 20a4 4 0 0 1 8 0M13 20a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function CurtainCard({ title, desc, icon }: { title: string; desc: string; icon: ReactNode }) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl",
        "border border-foreground/10 bg-foreground/5",
        "p-6 sm:p-7",
      ].join(" ")}
    >
      {/* БАЗОВЫЙ (тёмный) КОНТЕНТ */}
      <div className="relative z-10 transition-opacity duration-200 group-hover:opacity-0">
        <div className="text-foreground/80">{icon}</div>
        <div className="mt-4 text-xs text-foreground/60">Услуга</div>
        <h3 className="mt-2 text-lg sm:text-xl font-extrabold tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">{desc}</p>
      </div>

      {/* ШТОРА: из правого верхнего угла, полностью перекрывает */}
      <div
        className={[
          "pointer-events-none absolute inset-0 z-20",
          "bg-foreground",
          "origin-top-right",
          "scale-0 group-hover:scale-100",
          "transition-transform duration-500 ease-out",
        ].join(" ")}
      />

      {/* HOVER-КОНТЕНТ */}
      <div
        className={[
          "pointer-events-none absolute inset-0 z-30 p-6 sm:p-7",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200 delay-150",
        ].join(" ")}
      >
        <div className="text-background/80">{icon}</div>
        <div className="mt-4 text-xs text-background/70">Услуга</div>
        <h3 className="mt-2 text-lg sm:text-xl font-extrabold tracking-tight text-background">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-background/80">{desc}</p>

        {/* стрелка только на открытой шторе */}
        <div className="pointer-events-none absolute right-6 top-6 text-background opacity-0 transition-opacity duration-200 delay-150 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </article>
  );
}

// ... SERVICES и CurtainCard без изменений

export default function HeroSection() {
  const [openConsult, setOpenConsult] = useState(false);

  return (
    <section id="services" className="relative overflow-hidden border-b border-foreground/10">
      <ConsultationModal open={openConsult} onClose={() => setOpenConsult(false)} />

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
              Разрабатываем сайты и развиваем сервисы - принося результат бизнесу
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
              От идеи и дизайна до AI, CRM и аналитики — под ключ. Делаем не шаблоны, а решения под ваши задачи.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                onClick={() => setOpenConsult(true)}
              >
                Получить консультацию
              </Button>

              <Button href={TG_BOT_LINK} variant="outline">
                Обсудить проект
              </Button>

              <Button href="tel:+79999999999" variant="ghost">
                Позвонить
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <CurtainCard key={s.title} title={s.title} desc={s.desc} icon={s.icon} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
