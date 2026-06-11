import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { loginPatient } from "./actions";

export default async function PatientLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="rounded-xl bg-accent/15 p-3">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-lg font-semibold">Sonrisa+</h1>
          <p className="text-sm text-muted">Ingresa a tu programa de fidelización</p>
        </div>

        <form action={loginPatient} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Correo electrónico</span>
            <input
              type="email"
              name="email"
              required
              defaultValue="maria.perez@email.com"
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Contraseña</span>
            <input
              type="password"
              name="password"
              required
              defaultValue="paciente123"
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
            Iniciar sesión
          </button>
        </form>

        <a
          href="/paciente/forgot-password"
          className="mt-4 block text-center text-xs font-medium text-muted hover:text-foreground"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </Card>
    </div>
  );
}
