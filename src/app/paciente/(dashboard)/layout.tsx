import Link from "next/link";
import Image from "next/image";
import { Home, Gift, Stamp, HeartPulse, Users, LogOut } from "lucide-react";
import { logoutPatient } from "../login/actions";
import { getPatientBranding } from "@/lib/data/patient";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/paciente", label: "Inicio", icon: Home },
  { href: "/paciente/beneficios", label: "Beneficios", icon: Gift },
  { href: "/paciente/recompensas", label: "Sellos", icon: Stamp },
  { href: "/paciente/salud-oral", label: "Salud Oral", icon: HeartPulse },
  { href: "/paciente/referidos", label: "Referidos", icon: Users },
];

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const branding = await getPatientBranding();

  const style = branding?.primary_color
    ? { ["--accent" as string]: branding.primary_color }
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col" style={style}>
      <header className="flex items-center justify-between px-4 pt-4">
        {branding?.logo_url ? (
          <Image
            src={branding.logo_url}
            alt={branding.display_name ?? "Logo"}
            width={28}
            height={28}
            className="rounded-lg object-contain"
            unoptimized
          />
        ) : (
          <span className="text-sm font-semibold">{branding?.display_name ?? ""}</span>
        )}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <form action={logoutPatient}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-danger"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-4 pb-24 pt-2">{children}</main>
      <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-border bg-surface/90 backdrop-blur">
        <div className="grid grid-cols-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-3 text-[11px] text-muted transition-colors hover:text-foreground"
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
