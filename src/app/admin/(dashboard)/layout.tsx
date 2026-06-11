import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Award,
  Megaphone,
  BarChart3,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "../login/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pacientes", label: "Pacientes", icon: Users },
  { href: "/admin/fidelizacion", label: "Fidelización", icon: Award },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
        <div className="flex items-center justify-between gap-2 px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-accent/15 p-2">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold">Sonrisa+</p>
              <p className="text-xs text-muted">Panel administrativo</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAdmin} className="mt-auto px-3 pb-5">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-danger"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </form>
      </aside>
      <header className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent/15 p-2">
            <Building2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold">Sonrisa+</p>
            <p className="text-xs text-muted">Panel administrativo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center justify-center rounded-full border border-border bg-surface-2 p-2 text-muted transition-colors hover:text-danger"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </form>
        </div>
      </header>
      <nav className="fixed bottom-0 left-0 z-10 flex w-full items-center gap-1 overflow-x-auto border-t border-border bg-surface/90 px-2 py-1.5 backdrop-blur md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <item.icon className="h-4 w-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="flex-1 overflow-x-hidden p-4 pb-20 md:p-8 md:pb-8">{children}</main>
    </div>
  );
}
