// src/components/landing/NextStepSection.tsx
"use client";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import ConsultationModal from "@/components/landing/ConsultationModal";

const TG_BOT_LINK = "https://t.me/ProfitSiteruBot";
const PHONE = "+79999999999";

export default function NextStepSection() {
  const [openConsult, setOpenConsult] = useState(false);

  return (
    <section id="contacts">
      <div id="next-step">
        <ConsultationModal open={openConsult} onClose={() => setOpenConsult(false)} />

        <Container>
          <div className="py-14 sm:py-20">
            <div className="rounded-3xl border border-foreground/12 bg-foreground/3 p-6 sm:p-10">
              <h2 className="text-2xl font-bold sm:text-3xl">Что делать дальше?</h2>
              <p className="mt-3 max-w-2xl text-foreground/70">
                Опишите задачу — мы предложим оптимальное решение.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-foreground/12 bg-background p-6">
                  <div className="text-sm font-semibold">Связаться</div>

                  <div className="mt-4 grid gap-3">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => setOpenConsult(true)}
                    >
                      Получить консультацию
                    </Button>

                    <Button href={TG_BOT_LINK} variant="outline" className="w-full">
                      Обсудить проект
                    </Button>

                    <Button href={`tel:${PHONE}`} variant="outline" className="w-full">
                      Позвонить
                    </Button>

                    <div className="mt-4 rounded-xl bg-foreground/5 p-4 text-sm text-foreground/75">
                      Мы работаем спокойно и прозрачно: фиксируем этапы, держим связь,
                      двигаемся к измеримому результату.
                    </div>

                    <div className="text-xs text-foreground/60">
                      Телефон: {PHONE} • Telegram: @ProfitSiteruBot
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/12 bg-background p-6">
                  <div className="text-sm font-semibold">Что будет дальше</div>
                  <div className="mt-3 text-sm text-foreground/70">
                    Нажмите “Получить консультацию” — откроется форма заявки.
                    Следующим шагом подключим реальную отправку в Telegram через backend (FastAPI).
                  </div>

                  <div className="mt-4 rounded-xl bg-foreground/5 p-4 text-sm text-foreground/75">
                    Подготовьте: цель проекта, пример/референс, сроки и желаемые интеграции (CRM, аналитика, AI).
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-foreground/60">
                Следующий шаг: подключим реальную отправку формы в Telegram через backend (FastAPI).
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
