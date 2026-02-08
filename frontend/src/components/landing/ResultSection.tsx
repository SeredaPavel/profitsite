// src/components/landing/ResultSection.tsx
import Container from "@/components/ui/Container";

const RESULTS = [
  "Понятный и управляемый сайт",
  "Рост заявок / конверсии",
  "Автоматизация процессов",
  "Данные для принятия решений",
  "Возможность масштабироваться",
];

export default function ResultSection() {
  return (
    <section id="solutions" className="border-b border-foreground/10">
      <Container>
        <div className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Какой результат вы получите
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESULTS.map((r) => (
              <div
                key={r}
                className="rounded-2xl border border-foreground/12 bg-foreground/3 p-6"
              >
                <div className="text-sm font-semibold">{r}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-foreground/12 p-6">
            <div className="text-sm font-semibold">Обещание по срокам</div>
            <div className="mt-2 text-sm text-foreground/70">
              Через 7 дней у вас будет сайт.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
