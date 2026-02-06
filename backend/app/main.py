# backend/app/main.py
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
import aiosmtplib
from email.message import EmailMessage

app = FastAPI(title="ProfitSite API", version="1.0.0")

class LeadIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    phone: str = Field(min_length=3, max_length=40)
    telegram: str = Field(default="", max_length=80)
    message: str = Field(default="", max_length=2000)
    email: EmailStr | None = None  # опционально

def env_required(key: str) -> str:
    v = os.getenv(key)
    if not v:
        raise RuntimeError(f"Missing env var: {key}")
    return v

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/lead")
async def create_lead(payload: LeadIn):
    try:
        smtp_host = env_required("SMTP_HOST")
        smtp_port = int(env_required("SMTP_PORT"))
        smtp_user = env_required("SMTP_USER")
        smtp_pass = env_required("SMTP_PASS")
        mail_to = env_required("MAIL_TO")  # profitsite_ru@mail.ru
        mail_from = os.getenv("SMTP_FROM", smtp_user)
        use_tls = os.getenv("SMTP_TLS", "true").lower() == "true"  # true для 465 SSL
        starttls = os.getenv("SMTP_STARTTLS", "false").lower() == "true"  # true для 587

        msg = EmailMessage()
        msg["Subject"] = "Новая заявка с ProfitSite.ru"
        msg["From"] = mail_from
        msg["To"] = mail_to

        lines = [
            "Новая заявка:",
            f"Имя: {payload.name}",
            f"Телефон: {payload.phone}",
            f"Telegram: {payload.telegram or '-'}",
            f"Email: {payload.email or '-'}",
            "",
            "Сообщение:",
            payload.message or "-",
        ]
        msg.set_content("\n".join(lines))

        await aiosmtplib.send(
            msg,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_pass,
            use_tls=use_tls,
            start_tls=starttls,
            timeout=20,
        )

        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
