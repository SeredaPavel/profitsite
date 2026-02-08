// src/components/landing/PricingSection.tsx
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

function PricingCard({
  title,
  price,
  desc,
}: {
  title: string;
  price: string;
  desc: string;
}) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl",
        "border border-foreground/10 bg-foreground/5",
        "p-6 sm:p-7",
      ].join(" ")}
    >
      {/* ШТОРКА */}
      <div
        className={[
          "pointer-events-none absolute inset-y-0 left-0",
          "w-[62%] -translate-x-[68%]",
          "rounded-r-[999px] bg-foreground",
          "transition-transform duration-500 ease-out",
          "group-hover:translate-x-0",
        ].join(" ")}
      />

      {/* Стрелка */}
      <div className="pointer-events-none absolute right-6 top-6 opacity-80 transition-opacity group-hover:opacity-100">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Обычный контент */}
      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div className="text-base sm:text-lg font-extrabold tracking-tight">{title}</div>
          <div className="text-base sm:text-lg font-extrabold whitespace-nowrap">{price}</div>
        </div>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/75">{desc}</p>

        <div className="mt-6">
          <Button
            href="#next-step"
            variant="outline"
            className={[
              "w-full",
              "group-hover:border-background/30 group-hover:bg-background/10 group-hover:text-background",
            ].join(" ")}
          >
            Обсудить этот вариант
          </Button>
        </div>
      </div>

      {/* Hover-контент (чтобы текст стал “тёмным” на светлой шторке) */}
      <div className="pointer-events-none absolute inset-0 p-6 sm:p-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex items-start justify-between gap-6">
          <div className="text-base sm:text-lg font-extrabold tracking-tight text-background">{title}</div>
          <div className="text-base sm:text-lg font-extrabold whitespace-nowrap text-background">{price}</div>
        </div>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-background/80">{desc}</p>

        <div className="mt-6 rounded-2xl border border-background/20 bg-background/10 px-4 py-3 text-sm text-background/85">
          Нажмите “Обсудить этот вариант” — уточним сроки, объем и интеграции.
        </div>
      </div>
    </article>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="border-b border-foreground/10">
      <Container>
        <div className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Сколько это стоит</h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Прозрачная упаковка: выбираете формат — мы собираем решение под задачи.
          </p>

          {/* ЦЕНЫ — СЕТКА */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRICING.map((p) => (
              <PricingCard key={p.title} title={p.title} price={p.price} desc={p.desc} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
