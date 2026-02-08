// src/components/landing/ProofSection.tsx
import Container from "@/components/ui/Container";

const FACTS = [
  "Разработка сайта и запуск за 7 дней",
  "5 лет в веб-разработке",
  "Прозрачный процесс, фиксация по этапам",
];

const CASES = Array.from({ length: 8 }).map((_, i) => ({
  title: `Кейс ${i + 1}`,
  text: "Короткое описание результата (заполним, когда будут материалы).",
}));

const REVIEWS = [
  { name: "Клиент А", text: "Быстро, понятно, аккуратно. Получили результат." },
  { name: "Клиент B", text: "Сделали структуру, дизайн и запуск без хаоса." },
  { name: "Клиент C", text: "Подключили аналитику и стало понятно, что работает." },
  { name: "Клиент D", text: "Доработки и поддержка — всегда на связи." },
];

export default function ProofSection() {
  return (
    <section id="cases" className="border-b border-foreground/10">
      <Container>
        <div className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Можно ли нам доверять?
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {FACTS.map((f) => (
              <div
                key={f}
                className="rounded-2xl border border-foreground/12 bg-background p-6"
              >
                <div className="text-sm font-semibold">{f}</div>
                <div className="mt-2 text-sm text-foreground/70">
                  Мы не гонимся за количеством — нам важен результат каждого проекта.
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="text-sm font-semibold">Кейсы</div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CASES.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-foreground/12 p-5 transition hover:border-foreground/25"
                >
                  <div className="text-sm font-semibold">{c.title}</div>
                  <div className="mt-2 text-sm text-foreground/70">{c.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="text-sm font-semibold">Отзывы</div>
            <div className="mt-4 overflow-x-auto">
              <div className="flex min-w-215 gap-4 pb-2">
                {REVIEWS.map((r) => (
                  <div
                    key={r.name}
                    className="w-[320px] shrink-0 rounded-2xl border border-foreground/12 p-5"
                  >
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="mt-2 text-sm text-foreground/70">{r.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-foreground/70">
            <span className="font-semibold">Важно:</span> кейсы и отзывы сейчас заглушки — структуру уже держим, наполнение добавим позже без переделок.
          </div>
        </div>
      </Container>
    </section>
  );
}
