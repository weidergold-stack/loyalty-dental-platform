import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { requestAdminPasswordReset } from "./actions";

export default async function AdminForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="rounded-xl bg-accent/15 p-3">
            <Building2 className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-lg font-semibold">Recuperar contraseña</h1>
          <p className="text-sm text-muted">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        {sent ? (
          <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
            Si el correo está registrado, recibirás un enlace para restablecer tu contraseña en
            unos minutos.
          </p>
        ) : (
          <form action={requestAdminPasswordReset} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Correo electrónico</span>
              <input
                type="email"
                name="email"
                required
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Enviar enlace
            </button>
          </form>
        )}

        <a
          href="/admin/login"
          className="mt-4 block text-center text-xs font-medium text-muted hover:text-foreground"
        >
          Volver a iniciar sesión
        </a>
      </Card>
    </div>
  );
}
