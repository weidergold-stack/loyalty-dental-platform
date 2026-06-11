import { Card, CardTitle } from "@/components/ui/Card";
import { Megaphone, Mail, MessageCircle, Smartphone } from "lucide-react";

const channels = [
  { icon: Smartphone, label: "Push notifications", desc: "Notificaciones a la app del paciente" },
  { icon: Mail, label: "Email marketing", desc: "Campañas y newsletters" },
  { icon: MessageCircle, label: "SMS", desc: "Mensajes de texto" },
  { icon: MessageCircle, label: "WhatsApp", desc: "Mensajes vía WhatsApp Business" },
];

export default function MarketingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Marketing</h1>
        <p className="text-sm text-muted">
          Crea campañas segmentadas por nivel, antigüedad o comportamiento.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((c) => (
          <Card key={c.label} className="flex flex-col items-start gap-2">
            <div className="rounded-xl bg-surface-2 p-2.5">
              <c.icon className="h-5 w-5 text-accent" />
            </div>
            <p className="font-medium">{c.label}</p>
            <p className="text-xs text-muted">{c.desc}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle className="mb-3 flex items-center gap-2">
          <Megaphone className="h-4 w-4" /> Plantillas sugeridas
        </CardTitle>
        <ul className="flex flex-col gap-2 text-sm">
          <li>"Te faltan 2 días para subir a Oro"</li>
          <li>"Has acumulado $50.000 en cashback"</li>
          <li>"Tienes una higiene preventiva disponible"</li>
          <li>"Te faltan 2 sellos para tu próxima recompensa"</li>
          <li>"Promoción exclusiva para miembros Diamante"</li>
        </ul>
      </Card>
    </div>
  );
}
