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

export default function PricingSection() {
  return (
    <section className="border-b border-foreground/10">
      <Container>
        <div className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Сколько это стоит</h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Прозрачная упаковка: выбираете формат — мы собираем решение под задачи.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRICING.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-foreground/12 bg-background p-6 transition hover:border-foreground/25"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-sm font-bold">{p.price}</div>
                </div>
                <div className="mt-3 text-sm text-foreground/70">{p.desc}</div>
                <div className="mt-5">
                  <Button href="#next-step" variant="outline" className="w-full">
                    Обсудить этот вариант
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
