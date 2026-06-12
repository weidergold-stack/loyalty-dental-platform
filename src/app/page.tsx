import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Smartphone, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Sonrisa+</h1>
        <p className="mt-2 max-w-md text-muted">
          Plataforma de fidelización para clínicas odontológicas. Membresías,
          cashback, sellos y saldo de salud oral.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Link href="/paciente">
          <Card className="flex h-full flex-col items-start gap-3 transition-colors hover:border-accent">
            <div className="rounded-xl bg-surface-2 p-3">
              <Smartphone className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-medium">App del Paciente</p>
              <p className="text-sm text-muted">
                Tarjeta digital, cashback, sellos y saldo de salud oral.
              </p>
            </div>
          </Card>
        </Link>

        <Link href="/admin">
          <Card className="flex h-full flex-col items-start gap-3 transition-colors hover:border-accent">
            <div className="rounded-xl bg-surface-2 p-3">
              <LayoutDashboard className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-medium">Portal Administrativo</p>
              <p className="text-sm text-muted">
                Dashboard, pacientes y configuración del programa.
              </p>
            </div>
          </Card>
        </Link>
      </div>

      <footer className="flex gap-4 text-xs text-muted">
        <Link href="/legal/privacidad" className="hover:underline">
          Política de privacidad
        </Link>
        <Link href="/legal/terminos" className="hover:underline">
          Términos y condiciones
        </Link>
      </footer>
    </div>
  );
}
