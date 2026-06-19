import Link from "next/link";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { registrarClinica } from "./actions";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="rounded-xl bg-accent/15 p-3">
            <Building2 className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-lg font-semibold">Registra tu clínica en Sonrisa+</h1>
          <p className="text-sm text-muted">
            Empieza gratis. Configura tu programa de fidelización en minutos.
          </p>
        </div>

        <form action={registrarClinica} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Nombre de la clínica</span>
            <input
              type="text"
              name="clinic_name"
              required
              placeholder="Ej: Clínica Dental San Pablo"
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Tu nombre completo</span>
            <input
              type="text"
              name="admin_name"
              required
              placeholder="Nombre del administrador"
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Teléfono (opcional)</span>
            <input
              type="tel"
              name="phone"
              placeholder="+57 300 000 0000"
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Correo electrónico</span>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@tuclinica.com"
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Contraseña (mínimo 8 caracteres)</span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
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
            Crear cuenta y empezar
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/admin/login" className="font-medium text-accent hover:underline">
            Iniciar sesión
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted">
          Al registrarte aceptas nuestros{" "}
          <Link href="/legal/terminos" className="hover:underline">Términos</Link>
          {" "}y{" "}
          <Link href="/legal/privacidad" className="hover:underline">Política de Privacidad</Link>.
        </p>
      </Card>
    </div>
  );
}
