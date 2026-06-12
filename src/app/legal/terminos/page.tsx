import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Sonrisa+",
};

const LAST_UPDATED = "12 de junio de 2026";

export default function TermsPage() {
  return (
    <>
      <h1>Términos y Condiciones</h1>
      <p>Última actualización: {LAST_UPDATED}</p>

      <p>
        Estos Términos y Condiciones (&quot;Términos&quot;) rigen el acceso y
        uso de la plataforma Sonrisa+ (la &quot;Plataforma&quot; o el
        &quot;Servicio&quot;), un software como servicio (&quot;SaaS&quot;) que
        provee herramientas de fidelización para clínicas odontológicas. Estos
        Términos aplican tanto a las clínicas que adquieren una suscripción al
        Servicio (&quot;Clínica&quot; o &quot;Cliente&quot;) como a los pacientes
        finales que usan la Plataforma a través de una Clínica
        (&quot;Paciente&quot; o &quot;Usuario&quot;). Al acceder o usar la
        Plataforma, aceptas estos Términos y la{" "}
        <a href="/legal/privacidad">Política de Privacidad</a>.
      </p>

      <h2>1. Descripción del servicio</h2>
      <p>
        Sonrisa+ ofrece un panel administrativo para que las Clínicas configuren
        y gestionen su programa de fidelización (membresías, niveles, sellos,
        cashback y saldo de salud oral), y una aplicación para que los
        Pacientes consulten su tarjeta digital, beneficios, recompensas y
        seguimiento de salud oral.
      </p>

      <h2>2. Suscripción de la Clínica al SaaS</h2>
      <ul>
        <li>El acceso a la Plataforma como Clínica requiere una suscripción activa, cuyas condiciones comerciales (plan, precio, periodicidad) se acuerdan al momento de la contratación.</li>
        <li>La Clínica es responsable de mantener vigente su información de cuenta, así como de la configuración de su propia pasarela de pagos (Wompi) para cobrar las membresías a sus pacientes. Sonrisa+ no es parte de la relación de pago entre la Clínica y sus Pacientes.</li>
        <li>La Clínica es responsable del contenido que publica en la Plataforma (marca, textos, configuración del programa de fidelización) y de obtener las autorizaciones necesarias de sus pacientes para el tratamiento de sus datos, incluyendo datos de salud, conforme a la <a href="/legal/privacidad">Política de Privacidad</a>.</li>
        <li>Sonrisa+ podrá suspender o cancelar el acceso de una Clínica en caso de impago, uso fraudulento de la Plataforma, o incumplimiento de estos Términos, previa notificación cuando sea razonablemente posible.</li>
        <li>La Clínica puede cancelar su suscripción en cualquier momento; la cancelación no genera reembolsos de periodos ya facturados, salvo que se acuerde lo contrario.</li>
      </ul>

      <h2>3. Uso de la aplicación por el Paciente</h2>
      <ul>
        <li>El acceso del Paciente a la Plataforma está vinculado a la Clínica que lo invita o registra. El programa de fidelización (beneficios, sellos, cashback, niveles y saldo de salud oral) es definido y administrado por cada Clínica, y puede variar entre clínicas.</li>
        <li>Los sellos, el cashback, el saldo de salud oral y los beneficios de membresía <strong>no constituyen dinero, depósito ni instrumento financiero</strong>, no son transferibles a terceros ni canjeables por dinero en efectivo, salvo que la Clínica indique expresamente lo contrario, y solo pueden utilizarse conforme a las reglas definidas por la Clínica.</li>
        <li>La Clínica puede modificar, en cualquier momento, las reglas de su programa de fidelización (porcentajes de cashback, requisitos de niveles, vigencia de beneficios), sin que ello genere responsabilidad para Sonrisa+.</li>
        <li>Los beneficios y saldos pueden expirar conforme a las políticas definidas por cada Clínica, las cuales serán comunicadas por la propia Clínica a sus pacientes.</li>
        <li>El Paciente es responsable de mantener la confidencialidad de sus credenciales de acceso y de notificar cualquier uso no autorizado de su cuenta.</li>
      </ul>

      <h2>4. Pagos</h2>
      <p>
        Los pagos de membresías realizados por los Pacientes se procesan a
        través de Wompi, utilizando la configuración de pagos propia de cada
        Clínica. Sonrisa+ no almacena datos completos de tarjetas de pago y no
        es responsable por errores, demoras o disputas relacionadas con el
        procesamiento de pagos por parte de Wompi o de la Clínica. Cualquier
        reclamo sobre cobros, reembolsos o facturación de una membresía debe
        dirigirse directamente a la Clínica correspondiente.
      </p>

      <h2>5. Conducta prohibida</h2>
      <p>Está prohibido:</p>
      <ul>
        <li>Usar la Plataforma para fines ilícitos o no autorizados.</li>
        <li>Intentar acceder sin autorización a cuentas, datos o sistemas de otras Clínicas o Pacientes.</li>
        <li>Realizar ingeniería inversa, copiar o explotar comercialmente la Plataforma sin autorización.</li>
        <li>Cargar contenido falso, difamatorio, o que infrinja derechos de terceros.</li>
        <li>Interferir con el funcionamiento normal del Servicio (por ejemplo, mediante ataques de denegación de servicio o automatización abusiva).</li>
      </ul>

      <h2>6. Propiedad intelectual</h2>
      <p>
        La Plataforma, su software, diseño, marcas y contenidos (con excepción
        de la marca, logo y contenido propio de cada Clínica) son propiedad de
        Sonrisa+ y están protegidos por las leyes de propiedad intelectual
        aplicables. Las Clínicas conservan la titularidad de su propia marca,
        logo y datos de sus pacientes.
      </p>

      <h2>7. Disponibilidad y soporte</h2>
      <p>
        Sonrisa+ procura mantener la disponibilidad continua de la Plataforma,
        pero no garantiza un servicio ininterrumpido o libre de errores.
        Podemos realizar mantenimientos programados o no programados,
        notificando con antelación razonable cuando sea posible.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley, Sonrisa+ no será responsable
        por daños indirectos, incidentales o consecuentes derivados del uso o
        imposibilidad de uso de la Plataforma, ni por decisiones comerciales,
        clínicas o de fidelización tomadas por cada Clínica. La responsabilidad
        total de Sonrisa+ frente a una Clínica, en cualquier caso, no excederá
        el valor pagado por dicha Clínica por el Servicio en los tres (3) meses
        anteriores al evento que originó el reclamo.
      </p>

      <h2>9. Modificaciones</h2>
      <p>
        Podemos actualizar estos Términos para reflejar cambios en el Servicio
        o en la normativa aplicable. La fecha de &quot;última actualización&quot;
        indicada al inicio refleja la versión vigente. El uso continuado de la
        Plataforma tras una actualización implica la aceptación de los nuevos
        Términos.
      </p>

      <h2>10. Ley aplicable y jurisdicción</h2>
      <p>
        Estos Términos se rigen por las leyes de la República de Colombia.
        Cualquier controversia derivada de estos Términos se someterá a los
        jueces competentes de Colombia, sin perjuicio de mecanismos de
        resolución alternativa de conflictos que las partes acuerden.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Para consultas sobre estos Términos, escríbenos a{" "}
        <a href="mailto:weidergold@gmail.com">weidergold@gmail.com</a>.
      </p>
    </>
  );
}
