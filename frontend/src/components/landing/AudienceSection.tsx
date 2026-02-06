// src/components/landing/AudienceSection.tsx
import Container from "@/components/ui/Container";

const AUDIENCE = [
  "Малый и средний бизнес",
  "Онлайн-сервисы и стартапы",
  "Эксперты и агентства",
  "Компании с существующими сайтами",
  "Проекты на стадии роста и масштабирования",
];

const ANCHORS = [
  "Если у вас ещё нет сайта — мы подходим.",
  "Если у вас уже есть сайт или вы планируете запуск — мы подходим.",
  "Если вы собираетесь масштабироваться — мы вам точно нужны.",
  "Если AI «хочется», но непонятно как применить — мы точно нужны вам.",
];

export default function AudienceSection() {
  return (
    <section className="border-b border-foreground/10">
      <Container>
        <div className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Работаем ли мы с такими, как вы?
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Мы решим вашу проблему: разработаем, настроим, сопроводим.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-foreground/12 p-6">
              <div className="text-sm font-semibold">Кому подходим</div>
              <ul className="mt-4 space-y-2 text-sm text-foreground/75">
                {AUDIENCE.map((a) => (
                  <li key={a} className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-foreground/60" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-foreground/12 p-6">
              <div className="text-sm font-semibold">Фраза-якорь</div>
              <div className="mt-4 space-y-3 text-sm text-foreground/75">
                {ANCHORS.map((t) => (
                  <div key={t} className="rounded-xl bg-foreground/5 p-4">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
