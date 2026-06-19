import { Resend } from "resend";
import twilio from "twilio";
import webpush from "web-push";

const resend = new Resend(process.env.RESEND_API_KEY);

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const FROM_EMAIL = process.env.RESEND_FROM ?? "Sonrisa+ <onboarding@resend.dev>";
const FROM_WHATSAPP = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";
const FROM_SMS = process.env.TWILIO_SMS_FROM ?? "";

if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@sonrisaplus.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export type DispatchResult = "sent" | "failed" | "skipped";

export async function dispatchEmail(
  to: string | null | undefined,
  message: string,
  clinicName: string
): Promise<DispatchResult> {
  if (!to) return "skipped";
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Mensaje de ${clinicName}`,
      html: `<p>${message}</p>`,
    });
    return error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}

export async function dispatchWhatsApp(
  to: string | null | undefined,
  message: string
): Promise<DispatchResult> {
  if (!to || !twilioClient) return "skipped";
  const normalized = to.startsWith("+") ? to : `+57${to.replace(/\D/g, "")}`;
  try {
    await twilioClient.messages.create({
      from: FROM_WHATSAPP,
      to: `whatsapp:${normalized}`,
      body: message,
    });
    return "sent";
  } catch {
    return "failed";
  }
}

export async function dispatchSMS(
  to: string | null | undefined,
  message: string
): Promise<DispatchResult> {
  if (!to || !twilioClient || !FROM_SMS) return "skipped";
  const normalized = to.startsWith("+") ? to : `+57${to.replace(/\D/g, "")}`;
  try {
    await twilioClient.messages.create({ from: FROM_SMS, to: normalized, body: message });
    return "sent";
  } catch {
    return "failed";
  }
}

export async function dispatchPush(
  subscription: object | null | undefined,
  message: string
): Promise<DispatchResult> {
  if (!subscription) return "skipped";
  try {
    await webpush.sendNotification(
      subscription as webpush.PushSubscription,
      JSON.stringify({ title: "Sonrisa+", body: message })
    );
    return "sent";
  } catch {
    return "failed";
  }
}
