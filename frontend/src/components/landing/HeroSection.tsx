// src/components/landing/HeroSection.tsx
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const SERVICES = [
  "Разработка сайтов",
  "Сопровождение и поддержка",
  "Оптимизация и скорость",
  "Внедрение AI",
  "UX/UI дизайн и проектирование",
  "Веб-интеграции",
  "CRM",
  "Аналитика",
];

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

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div
                  key={s}
                  className="group rounded-2xl border border-foreground/12 bg-background/60 p-4 backdrop-blur transition hover:border-foreground/25 hover:bg-foreground/[0.03]"
                >
                  <div className="text-sm font-semibold">{s}</div>
                  <div className="mt-2 text-xs text-foreground/60">
                    Быстро, аккуратно, с прицелом на рост.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
