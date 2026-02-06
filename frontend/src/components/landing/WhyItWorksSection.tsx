// src/components/landing/WhyItWorksSection.tsx
import Container from "@/components/ui/Container";

const POINTS = [
  {
    title: "Сценарии вместо «страниц»",
    text: "Проектируем пользовательские пути и точки конверсии, а не просто набор блоков.",
  },
  {
    title: "От бизнес-целей к дизайну",
    text: "Без «айтишной магии»: сначала цель, потом структура, потом визуал.",
  },
  {
    title: "Инструменты, которые дают эффект",
    text: "Аналитика, UX, автоматизация и AI — только там, где это реально усиливает результат.",
  },
  {
    title: "Думаем на шаг вперёд",
    text: "Масштабирование, интеграции, развитие продукта — закладываем основу сразу.",
  },
  {
    title: "Скорость и производительность",
    text: "Оптимизация под быстрые загрузки и стабильную работу.",
  },
];

export default function WhyItWorksSection() {
  return (
    <section className="border-b border-foreground/10">
      <Container>
        <div className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Почему наше решение работает
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Мы строим систему: сценарии → дизайн → разработка → измеримый результат.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POINTS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-foreground/12 bg-background p-5 transition hover:border-foreground/25"
              >
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="mt-2 text-sm text-foreground/70">{p.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
