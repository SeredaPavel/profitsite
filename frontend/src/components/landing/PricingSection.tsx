// src/components/landing/PricingSection.tsx
"use client";

import { useRef } from "react";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const PRICING = [
  {
    title: "Сайт-визитка",
    price: "110 000 ₽",
    desc: "Современная визитная карточка бизнеса, рассказывающая об услугах.",
  },
  {
    title: "Лендинг",
    price: "130 000 ₽",
    desc: "Идеально для промо-акции или теста ниши начинающему бизнесу.",
  },
  {
    title: "Сайт-каталог",
    price: "180 000 ₽",
    desc: "Для бизнеса с каталогом продукции без прямой онлайн-продажи.",
  },
  {
    title: "Интернет-магазин",
    price: "360 000 ₽",
    desc: "Эквайринг + доставка — расширение бизнеса за пределы региона.",
  },
  {
    title: "Онлайн-сервисы",
    price: "Индивидуально",
    desc: "Автоматизация процессов, экономия времени, снижение издержек.",
  },
  {
    title: "Индивидуальный",
    price: "1 400 000 ₽",
    desc: "Сложные проекты: AI, CRM, интеграции, аналитика, оптимизация инфраструктуры.",
  },
];

function PricingSlider() {
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
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="mt-8 flex gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
      style={{ scrollbarWidth: "none" }}
    >
      {PRICING.map((p) => (
        <article
          key={p.title}
          className={[
            "relative snap-start select-none",
            "min-w-[320px] sm:min-w-[420px] lg:min-w-[520px]",
            "rounded-3xl border border-foreground/10 bg-foreground/5",
            "p-6 sm:p-8",
            "transition",
            "group",
          ].join(" ")}
        >
          {/* Верхний ряд */}
          <div className="flex items-start justify-between gap-6">
            <div className="text-base sm:text-lg font-extrabold tracking-tight">
              {p.title}
            </div>

            <div className="text-base sm:text-lg font-extrabold whitespace-nowrap">
              {p.price}
            </div>
          </div>

          {/* Описание */}
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/75 max-w-[52ch]">
            {p.desc}
          </p>

          {/* CTA */}
          <div className="mt-6">
            <Button href="#next-step" variant="outline" className="w-full">
              Обсудить этот вариант
            </Button>
          </div>

          {/* Hover/Active overlay — как в блоке “Услуги” */}
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

          {/* Текст поверх overlay (чтобы читалось на тёмном) */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl p-6 sm:p-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
            <div className="flex items-start justify-between gap-6">
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-background">
                {p.title}
              </div>
              <div className="text-base sm:text-lg font-extrabold whitespace-nowrap text-background">
                {p.price}
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-background/80 max-w-[52ch]">
              {p.desc}
            </p>

            <div className="mt-6">
              <div className="rounded-2xl border border-background/20 bg-background/10 px-4 py-3 text-sm text-background/85">
                Нажмите “Обсудить этот вариант” — уточним сроки, объем и интеграции.
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="border-b border-foreground/10">
      <Container>
        <div className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Сколько это стоит</h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Прозрачная упаковка: выбираете формат — мы собираем решение под задачи.
          </p>

          <PricingSlider />

          <div className="mt-2 text-xs text-foreground/55">
            Можно листать колесом/тачпадом или “тянуть” мышкой.
          </div>
        </div>
      </Container>
    </section>
  );
}
